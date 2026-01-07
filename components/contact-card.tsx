"use client"

import type { Contact } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Calendar, MessageSquare } from "lucide-react"

interface ContactCardProps {
  contact: Contact
  onClick: () => void
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const lastInteraction = contact.interactions[0]
  const interactionCount = contact.interactions.length

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-card-foreground truncate">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          </div>
        </div>

        <p className="text-sm text-card-foreground line-clamp-2">{contact.context}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>
              {interactionCount} {interactionCount === 1 ? "interaction" : "interactions"}
            </span>
          </div>
          {lastInteraction && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(lastInteraction.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
