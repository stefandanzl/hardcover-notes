import {} from "./const"
import MyPlugin from "main"; 
import { PluginSettingTab, Setting, App } from "obsidian";

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Auth Bearer')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your Hardcover API Key')
				.setValue(this.plugin.settings.authBearer)
				.onChange(async (value) => {
					this.plugin.settings.authBearer = value;
					await this.plugin.saveSettings();
                    this.plugin.setClient()
				}));
	}
}