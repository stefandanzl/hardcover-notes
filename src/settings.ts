import {
	DEFAULT_DIRECTORY,
	DEFAULT_PROPERTYSET,
	NewBook,
	PropertySettings,
} from "./const";
import MyPlugin from "main";
import { PluginSettingTab, Setting, App, TextComponent } from "obsidian";

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Auth Bearer")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your Hardcover API Key")
					.setValue(this.plugin.settings.authBearer)
					.onChange(async (value: string) => {
						if (!value.startsWith("Bearer ")) {
							value = "Bearer " + value;
						}
						this.plugin.settings.authBearer = value;
						await this.plugin.saveSettings();
						this.plugin.setClient();
					})
			);

		new Setting(containerEl)
			.setName("Folder for Book Notes")
			.setDesc("If left empty defaults to 'Hardcover/'")
			.addText((text) =>
				text
					.setPlaceholder("Hardcover")
					.setValue(this.plugin.settings.directory)
					.onChange(async (value: string) => {
						if (value === "") {
							value = DEFAULT_DIRECTORY;
						}
						this.plugin.settings.directory = value;
						await this.plugin.saveSettings();
						this.plugin.setClient();
					})
			);

		new Setting(containerEl)
			.setName("Overwrite Frontmatter")
			.setDesc("If disabled not requested property fields will persist.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.overwriteFrontmatter)
					.onChange(async (value) => {
						this.plugin.settings.overwriteFrontmatter = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Overwrite Content")
			// .setDesc("Enable Synchronization on modification")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.overwriteContent)
					.onChange(async (value) => {
						this.plugin.settings.overwriteContent = value;
						await this.plugin.saveSettings();
					})
			);

		const textComponents: TextComponent[] = [];

		Object.entries(this.plugin.settings.propertySet).forEach(
			([prop, alias]) => {
				// // @ts-ignore
				// frontmatter[setting.alias] = book[prop];
				// delete oldFrontmatter[setting.alias];
				let thisText: TextComponent;
				let thisBool: boolean = true;

				new Setting(containerEl)
					.setName(prop)
					// .setDesc('It\'s a secret')
					.addText((text) => {
						text.setPlaceholder(prop).setValue(alias);
						thisText = text;
						textComponents.push(text);
						text.onChange(async (value: string) => {
							//@ts-ignore
							this.plugin.settings.propertySet[prop] = value;
							await this.plugin.saveSettings();
						});
					})
					.addExtraButton((button) => {
						button.onClick(async () =>{
							thisBool = !thisBool;

							const newValue = thisBool ? DEFAULT_PROPERTYSET[prop as keyof PropertySettings] :  "" ;
							thisText.setValue(newValue);
							this.plugin.settings.propertySet[prop as keyof PropertySettings] = newValue;
							await this.plugin.saveSettings();
						} );
					})
			}
		);

		new Setting(containerEl)
			.setName("Reset Frontmatter Properties")
			.setDesc("Set to default values")
			.addButton((button) =>
				button.onClick(async () => {
					this.plugin.settings.propertySet = {
						...DEFAULT_PROPERTYSET,
					};
					await this.plugin.saveSettings();
					// Update all text components with new values
					textComponents.forEach((textComponent, index) => {
						const prop = Object.keys(DEFAULT_PROPERTYSET)[index];
						textComponent.setValue(
							DEFAULT_PROPERTYSET[prop as keyof PropertySettings]
						);
					});
				})
			);

		new Setting(containerEl)
			.setName("Edit custom filter rules for shown books")
			.setDesc("")
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.filter)
					.onChange(async (value) => {
						this.plugin.settings.filter = value;
						await this.plugin.saveSettings();
						this.plugin.setClient();
					})
			);


			new Setting(containerEl)
			.setName("Edit your book note template:")
			.setDesc("")
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.templateContent)
					.onChange(async (value) => {
						this.plugin.settings.templateContent = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
