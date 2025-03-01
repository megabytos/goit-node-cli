import {program} from "commander";
import {addContact, getContactById, listContacts, removeContact, updateContact} from "./contacts.js";


program
    .option("-a, --action <type>", "choose action")
    .option("-i, --id <type>", "user id")
    .option("-n, --name <type>", "user name")
    .option("-e, --email <type>", "user email")
    .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

async function invokeAction({action, id, name, email, phone}) {
    try {
        switch (action) {
            case "list":
                console.table(await listContacts());
                break;

            case "get":
                if (!id) throw new Error("ID required.");
                console.log(await getContactById(id))
                break;

            case "add":
                console.log(await addContact(name, email, phone))
                break;

            case "remove":
                if (!id) throw new Error("ID required.");
                console.log(await removeContact(id))
                break;

            case "update":
                if (!id) throw new Error("ID required.");
                console.log(await updateContact(id, name, email, phone))
                break;

            default:
                console.warn("\x1B[31m Unknown action type!");
        }
    } catch (error) {
        console.error("\x1B[31mError:", error.message);
    }
}

(async () => {
    await invokeAction(options).catch(error => console.error("Error:", error.message));
})();
