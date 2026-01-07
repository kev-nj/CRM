"use client"

import { useState, useEffect } from "react"
import { type Contact, storage } from "@/lib/storage"
import { ContactCard } from "@/components/contact-card"
import { ContactDetail } from "@/components/contact-detail"
import { AddContactDialog } from "@/components/add-contact-dialog"
import { AdvancedSearch, type SearchFilters } from "@/components/advanced-search"
import { Logo } from "@/components/logo"
import { Users } from "lucide-react"

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchIn: "all",
    relationship: "all",
  })
  const [relationships, setRelationships] = useState<string[]>([])

  const loadContacts = () => {
    const allContacts = storage.getContacts()
    setContacts(allContacts)
    setRelationships(storage.getUniqueRelationships())
    if (selectedContact) {
      const updated = allContacts.find((c) => c.id === selectedContact.id)
      setSelectedContact(updated || null)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query)
    setSearchFilters(filters)
  }

  const filteredContacts =
    searchQuery || searchFilters.searchIn !== "all" || searchFilters.relationship !== "all"
      ? storage.advancedSearch(searchQuery, searchFilters)
      : contacts

  if (selectedContact) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto p-4 py-8">
          <ContactDetail contact={selectedContact} onBack={() => setSelectedContact(null)} onUpdate={loadContacts} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted-foreground text-pretty">
            Keep track of the people in your life and the stories they share
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <AdvancedSearch onSearch={handleSearch} relationships={relationships} />
          </div>
          <AddContactDialog onContactAdded={loadContacts} />
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">No contacts yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-pretty">
                Start building meaningful relationships by adding your first contact
              </p>
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No contacts match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} onClick={() => setSelectedContact(contact)} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
