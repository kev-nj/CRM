export interface Interaction {
  id: string
  date: string
  notes: string
  tags?: string[]
}

export interface Contact {
  id: string
  name: string
  context: string
  relationship: string
  keyFacts: string[]
  interactions: Interaction[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "remember-crm-contacts"

export const storage = {
  getContacts(): Contact[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveContacts(contacts: Contact[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  },

  addContact(contact: Omit<Contact, "id" | "createdAt" | "updatedAt" | "interactions">): Contact {
    const contacts = this.getContacts()
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      keyFacts: contact.keyFacts || [],
      interactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    contacts.push(newContact)
    this.saveContacts(contacts)
    return newContact
  },

  updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const contacts = this.getContacts()
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) return null

    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveContacts(contacts)
    return contacts[index]
  },

  deleteContact(id: string): boolean {
    const contacts = this.getContacts()
    const filtered = contacts.filter((c) => c.id !== id)
    if (filtered.length === contacts.length) return false
    this.saveContacts(filtered)
    return true
  },

  addInteraction(contactId: string, interaction: Omit<Interaction, "id">): Interaction | null {
    const contacts = this.getContacts()
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return null

    const newInteraction: Interaction = {
      ...interaction,
      id: Date.now().toString(),
    }

    contact.interactions.unshift(newInteraction)
    contact.updatedAt = new Date().toISOString()
    this.saveContacts(contacts)
    return newInteraction
  },

  deleteInteraction(contactId: string, interactionId: string): boolean {
    const contacts = this.getContacts()
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return false

    const filtered = contact.interactions.filter((i) => i.id !== interactionId)
    if (filtered.length === contact.interactions.length) return false

    contact.interactions = filtered
    contact.updatedAt = new Date().toISOString()
    this.saveContacts(contacts)
    return true
  },

  searchContacts(query: string): Contact[] {
    const contacts = this.getContacts()
    const lowerQuery = query.toLowerCase()
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.context.toLowerCase().includes(lowerQuery) ||
        contact.relationship.toLowerCase().includes(lowerQuery) ||
        contact.interactions.some(
          (i) =>
            i.notes.toLowerCase().includes(lowerQuery) || i.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
        ),
    )
  },

  advancedSearch(query: string, filters: { searchIn: string; relationship: string }): Contact[] {
    let contacts = this.getContacts()
    const lowerQuery = query.toLowerCase()

    // Filter by relationship first
    if (filters.relationship !== "all") {
      contacts = contacts.filter((c) => c.relationship === filters.relationship)
    }

    // If no search query, return filtered by relationship only
    if (!query.trim()) {
      return contacts
    }

    // Apply search based on searchIn filter
    return contacts.filter((contact) => {
      switch (filters.searchIn) {
        case "names":
          return contact.name.toLowerCase().includes(lowerQuery)
        case "conversations":
          return contact.interactions.some((i) => i.notes.toLowerCase().includes(lowerQuery))
        case "context":
          return contact.context.toLowerCase().includes(lowerQuery)
        case "all":
        default:
          return (
            contact.name.toLowerCase().includes(lowerQuery) ||
            contact.context.toLowerCase().includes(lowerQuery) ||
            contact.relationship.toLowerCase().includes(lowerQuery) ||
            contact.keyFacts?.some((fact) => fact.toLowerCase().includes(lowerQuery)) ||
            contact.interactions.some((i) => i.notes.toLowerCase().includes(lowerQuery))
          )
      }
    })
  },

  getUniqueRelationships(): string[] {
    const contacts = this.getContacts()
    const relationships = contacts.map((c) => c.relationship)
    return Array.from(new Set(relationships)).sort()
  },
}
