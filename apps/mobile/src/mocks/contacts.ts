export type DumpContact = {
  id: string;
  name: string;
  phoneNumber: string;
  note: string;
  tag: string;
  city: string;
  vibe: string;
  color: "accent" | "olive" | "plum";
  archived?: boolean;
};

export const mockContacts: DumpContact[] = [
  {
    id: "1",
    name: "Mumbai Broker",
    phoneNumber: "+91 99999 99999",
    note: "2BHK rentals in Andheri. Sharp, replies late, knows inventory before it hits WhatsApp groups.",
    tag: "broker",
    city: "Mumbai",
    vibe: "Fast lane",
    color: "accent"
  },
  {
    id: "2",
    name: "Lighting Vendor",
    phoneNumber: "+91 88888 88888",
    note: "Event setup, warm tube lights, last-minute rescues. Better on calls than texts.",
    tag: "vendor",
    city: "Bengaluru",
    vibe: "Reliable under chaos",
    color: "olive"
  },
  {
    id: "3",
    name: "Cabin Carpenter",
    phoneNumber: "+91 77777 77777",
    note: "Studio shelves and hidden storage. Sends rough sketches on paper, not apps.",
    tag: "carpenter",
    city: "Pune",
    vibe: "Old-school craft",
    color: "plum"
  },
  {
    id: "4",
    name: "Venue Scout",
    phoneNumber: "+91 66666 66666",
    note: "Industrial spaces for pop-ups. Good eye, expensive taste.",
    tag: "events",
    city: "Delhi",
    vibe: "Knows the corners",
    color: "accent",
    archived: true
  }
];

export function getContactById(id?: string | string[]) {
  return mockContacts.find((contact) => contact.id === id) ?? mockContacts[0];
}
