import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { DumpContact, mockContacts } from "@/mocks/contacts";

type ContactDraft = {
  name: string;
  phoneNumber: string;
  note: string;
  tag: string;
  city: string;
  vibe: string;
  archived?: boolean;
};

type ContactsContextValue = {
  contacts: DumpContact[];
  addContact: (draft: ContactDraft) => DumpContact;
  updateContact: (id: string, draft: Partial<ContactDraft>) => DumpContact | null;
  getContactById: (id?: string | string[]) => DumpContact | null;
};

const ContactsContext = createContext<ContactsContextValue | null>(null);

function deriveColor(tag: string): DumpContact["color"] {
  const normalized = tag.trim().toLowerCase();

  if (["broker", "lead", "freelancer", "scout", "agent"].includes(normalized)) {
    return "accent";
  }

  if (["vendor", "service", "courier", "driver", "helper"].includes(normalized)) {
    return "olive";
  }

  return "plum";
}

export function ContactsProvider({ children }: PropsWithChildren) {
  const [contacts, setContacts] = useState<DumpContact[]>(mockContacts);

  const value = useMemo<ContactsContextValue>(
    () => ({
      contacts,
      addContact: (draft) => {
        const nextContact: DumpContact = {
          id: String(Date.now()),
          name: draft.name.trim() || "Untitled contact",
          phoneNumber: draft.phoneNumber.trim(),
          note: draft.note.trim(),
          tag: draft.tag.trim().toLowerCase() || "general",
          city: draft.city.trim() || "Unknown",
          vibe: draft.vibe.trim() || "Unsorted",
          color: deriveColor(draft.tag),
          archived: draft.archived ?? false
        };

        setContacts((current) => [nextContact, ...current]);
        return nextContact;
      },
      updateContact: (id, draft) => {
        let updatedContact: DumpContact | null = null;

        setContacts((current) =>
          current.map((contact) => {
            if (contact.id !== id) {
              return contact;
            }

            updatedContact = {
              ...contact,
              ...draft,
              tag: draft.tag ? draft.tag.trim().toLowerCase() || contact.tag : contact.tag,
              color: draft.tag ? deriveColor(draft.tag) : contact.color
            };

            return updatedContact;
          })
        );

        return updatedContact;
      },
      getContactById: (id) => contacts.find((contact) => contact.id === id) ?? null
    }),
    [contacts]
  );

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error("useContacts must be used within ContactsProvider.");
  }

  return context;
}
