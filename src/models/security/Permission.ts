
/** List of all permissions */
export enum PERMISSIONS {
	ADMIN = "Admin",
	MANAGE_STORAGE = "Manage Storage",
	MANAGE_MATERIALS = "Manage Materials",
	MANAGE_TAGS = "Manage Tags"
}


/** Verbose description of each permission */
export enum PERMISSION_DESCRIPTION {
	ADMIN = "The Admin is allowed to access every page and edit everything.",
	MANAGE_STORAGE = "This permission allows the user to access and edit the storage page.",
	MANAGE_MATERIALS = "This permission allows the user to access and edit the materials page.",
	MANAGE_TAGS = "This permission allows the user to access and edit the tags page."
}


 /** Short description of each permission
	* i.e.: This user will be able to [...]*/
export enum SHORT_DESCRIPTION {
	"Admin" = "access and edit everything",
	"Manage Storage" = "access and edit the storage page",
	"Manage Materials" = "access and edit the materials page",
	"Manage Tags" = "access and edit the tags page"
}