import { Notice, Editor, MarkdownEditView, MarkdownView } from "obsidian";
import { SampleSettingTab } from "settings";
import MyPlugin from "main";
import { GraphQLClient } from "graphql-request";

export async function launcher(plugin: MyPlugin) {
	await plugin.loadSettings();

	// if (plugin.settings.authBearer === ''){
	//     console.error("API KEY not set")
	//     return
	// }

	plugin.setClient();

	// This creates an icon in the left ribbon.
	const ribbonIconEl = plugin.addRibbonIcon(
		"dice",
		"Sample Plugin",
		(evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("Processing started!");
			plugin.fileWriter();
		}
	);
	// Perform additional things with the ribbon
	ribbonIconEl.addClass("my-plugin-ribbon-class");

	// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
	const statusBarItemEl = plugin.addStatusBarItem();
	statusBarItemEl.setText("Status Bar Text");

	// This adds a settings tab so the user can configure various aspects of the plugin
	plugin.addSettingTab(new SampleSettingTab(plugin.app, plugin));
}
