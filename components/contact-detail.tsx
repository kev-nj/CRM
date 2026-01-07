"use client"

import { useState } from "react"
import { type Contact, storage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Edit2, X, Check } from "lucide-react"

interface ContactDetailProps {
  contact: Contact
  onBack: () => void
  onUpdate: () => void
}

export function ContactDetail({ contact, onBack, onUpdate }: ContactDetailProps) {
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [editedName, setEditedName] = useState(contact.name)
  const [editedRelationship, setEditedRelationship] = useState(contact.relationship)
  const [editedContext, setEditedContext] = useState(contact.context)

  const [keyFacts, setKeyFacts] = useState<string[]>(contact.keyFacts || [])
  const [newKeyFact, setNewKeyFact] = useState("")
  const [showAddKeyFact, setShowAddKeyFact] = useState(false)

  const [showAddInteraction, setShowAddInteraction] = useState(false)
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split("T")[0])
  const [interactionNotes, setInteractionNotes] = useState("")

  const handleSaveContact = () => {
    storage.updateContact(contact.id, {
      name: editedName,
      relationship: editedRelationship,
      context: editedContext,
    })
    setIsEditingContact(false)
    onUpdate()
  }

  const handleCancelEdit = () => {
    setEditedName(contact.name)
    setEditedRelationship(contact.relationship)
    setEditedContext(contact.context)
    setIsEditingContact(false)
  }

  const handleAddKeyFact = () => {
    if (!newKeyFact.trim()) return

    const updatedFacts = [...keyFacts, newKeyFact.trim()]
    setKeyFacts(updatedFacts)

    storage.updateContact(contact.id, {
      keyFacts: updatedFacts,
    })

    setNewKeyFact("")
    setShowAddKeyFact(false)
    onUpdate()
  }

  const handleDeleteKeyFact = (index: number) => {
    const updatedFacts = keyFacts.filter((_, i) => i !== index)
    setKeyFacts(updatedFacts)

    storage.updateContact(contact.id, {
      keyFacts: updatedFacts,
    })

    onUpdate()
  }

  const handleAddInteraction = () => {
    if (!interactionNotes.trim()) return

    storage.addInteraction(contact.id, {
      date: interactionDate,
      notes: interactionNotes.trim(),
    })

    setInteractionNotes("")
    setInteractionDate(new Date().toISOString().split("T")[0])
    setShowAddInteraction(false)
    onUpdate()
  }

  const handleDeleteInteraction = (interactionId: string) => {
    if (confirm("Delete this interaction?")) {
      storage.deleteInteraction(contact.id, interactionId)
      onUpdate()
    }
  }

  const handleDeleteContact = () => {
    if (confirm(`Delete ${contact.name}? This cannot be undone.`)) {
      storage.deleteContact(contact.id)
      onBack()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDeleteContact}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-6">
        {isEditingContact ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-relationship">Relationship</Label>
              <Input
                id="edit-relationship"
                value={editedRelationship}
                onChange={(e) => setEditedRelationship(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-context">Context</Label>
              <Textarea
                id="edit-context"
                value={editedContext}
                onChange={(e) => setEditedContext(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSaveContact}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-card-foreground">{contact.name}</h2>
                <p className="text-muted-foreground">{contact.relationship}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsEditingContact(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {contact.context && <p className="text-card-foreground">{contact.context}</p>}
          </>
        )}
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Key Facts</h3>
          <Button size="sm" onClick={() => setShowAddKeyFact(!showAddKeyFact)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {showAddKeyFact && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-fact">Quick Fact</Label>
                <Input
                  id="key-fact"
                  placeholder="e.g., Has 2 kids, Loves fishing, Allergic to peanuts..."
                  value={newKeyFact}
                  onChange={(e) => setNewKeyFact(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddKeyFact()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddKeyFact(false)
                    setNewKeyFact("")
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddKeyFact}>
                  Save
                </Button>
              </div>
            </div>
          </Card>
        )}

        {keyFacts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No key facts yet. Add quick facts to remember important details!</p>
          </Card>
        ) : (
          <Card className="p-4">
            <ul className="space-y-2">
              {keyFacts.map((fact, index) => (
                <li key={index} className="flex items-start justify-between gap-4 group">
                  <span className="flex-1 text-card-foreground">• {fact}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKeyFact(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Interactions</h3>
          <Button size="sm" onClick={() => setShowAddInteraction(!showAddInteraction)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {showAddInteraction && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interaction-date">Date</Label>
                <Input
                  id="interaction-date"
                  type="date"
                  value={interactionDate}
                  onChange={(e) => setInteractionDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interaction-notes">What happened?</Label>
                <Textarea
                  id="interaction-notes"
                  placeholder="Stories they told, topics discussed, promises made..."
                  value={interactionNotes}
                  onChange={(e) => setInteractionNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddInteraction(false)
                    setInteractionNotes("")
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddInteraction}>
                  Save
                </Button>
              </div>
            </div>
          </Card>
        )}

        {contact.interactions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No interactions yet. Add one to start tracking your conversations!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {contact.interactions.map((interaction) => (
              <Card key={interaction.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(interaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-card-foreground whitespace-pre-wrap">{interaction.notes}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteInteraction(interaction.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
