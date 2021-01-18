declare type RequireFunction = (modules: string[], callback?: Function, err?: Function) => void;

declare let requirejs: {
	(config: RequireConfig, modules: string[], callback?: Function, err?: Function);
	(config: RequireConfig): RequireFunction;
	(modules: string[], callback?: Function, err?: Function);
	config: (args: RequireConfig) => RequireFunction;
	exec(name: string);
	load(context: RequireContext, id: string, url: string);
};

type RequireContext = {
	config: RequireConfig
}

interface RequireConfig {

}

interface RequireShim {

	/**
	* List of dependencies.
	**/
	deps?: string[];

	/**
	* Name the module will be exported as.
	**/
	exports?: string;

	/**
	* Initialize function with all dependcies passed in,
	* if the function returns a value then that value is used
	* as the module export value instead of the object
	* found via the 'exports' string.
	* @param dependencies
	* @return
	**/
	init?: (...dependencies: any[]) => any;
}

// type SimpleMenuItem = {
//     name: string;
//     path?: string | (() => string);
//     icon?: string;
//     children?: SimpleMenuItem[];
// };




declare let define: Function;

declare module "js-md5" {
	let md5: {
		(text: string): string;
	};
	export = md5;
}

declare module "auth/settings" {
	let settings: { gateway: string };
	export = settings;
}

declare module "json!websiteConfig" {
	let a: import("./types").WebsiteConfig;
	export = a;
}

declare module "lessjs" {

	class FileManager {
		extractUrlParts: (url: string, baseUrl: string) => string;
	}

	let less: {
		render: (content: string, callback: (e: Error, result: { css: string }) => void) => void;
		FileManager: typeof FileManager
	}


	export = less;
}

declare module "startup" {
	let r: typeof import("./startup");
	export = r;
}
