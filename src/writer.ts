import {MarkdownEditView, App} from "obsidian"
import { Book } from "const"
import MyPlugin from "main";

export class Adapter{
    plugin: MyPlugin;

    constructor(plugin: MyPlugin){
        this.plugin = plugin
    }

// export function write(books: Book[]){

// books.forEach(element => {
//     element.title
// });


// }
}