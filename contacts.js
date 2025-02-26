import {readFile, writeFile} from "node:fs/promises";
import * as path from "node:path";
import {nanoid} from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");
const updateContacts = async (contacts) => {
    try {
        await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch (error) {
        console.error("Error writing to file:", error);
        throw new Error("Failed to update contacts.");
    }
};

export async function listContacts() {
    try {
        const data = await readFile(contactsPath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        console.error("Error reading file:", error);
        throw new Error("Failed to load contacts.");
    }
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId) || null;
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
}

export async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
        throw new Error("All fields (name, email, phone) are required.");
    }
    const contacts = await listContacts();
    const newContact = {id: nanoid(), name, email, phone};
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

export async function updateContact(contactId, name, email, phone) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;
    if (name) contacts[index].name = name;
    if (email) contacts[index].email = email;
    if (phone) contacts[index].phone = phone;
    await updateContacts(contacts);
    return contacts[index];
}