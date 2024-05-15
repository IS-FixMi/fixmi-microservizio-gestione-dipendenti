 enum PermissionLevel{
    NonAutenticato = 'NonAutenticato',
    Cliente = 'Cliente',
    Dipendente = 'Dipendente',
    Manager = 'Manager'
}
 export default PermissionLevel;
export function strToPermissionLevel(input: string): PermissionLevel{
    switch (input){
        case "Cliente":
            return PermissionLevel.Cliente
        case "Dipendente":
            return PermissionLevel.Dipendente
        case "Manager":
            return PermissionLevel.Manager
        default:
            return PermissionLevel.NonAutenticato
    }
}
export function checkPermission(required: PermissionLevel, provided: PermissionLevel): boolean{
    if(required == provided){
        return true;
    }
    if (required == PermissionLevel.NonAutenticato){
        return true;
    }
    if(required == PermissionLevel.Cliente){
        if(provided == PermissionLevel.NonAutenticato){
            return false;
        }
        return true;
    }
    if(required == PermissionLevel.Dipendente){
        if(provided == PermissionLevel.Dipendente || provided== PermissionLevel.Manager){
            return true;
        }
        return false;
    }
    return false;

}