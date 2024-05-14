

enum TaskTag {
    Negozio = 'Negozio',
    Riparazione = 'Riparazione',
    Magazzino = 'Magazzino',
    Assistenza = 'Assistenza',
    Feedback = 'Feedback'
}
export default TaskTag
export function toTaskTagArray(arr: string[]): TaskTag[] | null{
const new_arr: TaskTag[] = []
for(const i of arr){
    const x = strToTaskTag(i.trim())
    if(x == null){
        return null;
    }
    new_arr.push(x)
}
return new_arr;
}

function strToTaskTag(input: string): TaskTag|null{
    switch (input){
        case "Negozio":
            return TaskTag.Negozio
            
        case "Riparazione":
            return TaskTag.Riparazione
            
        case "Magazzino":
            return TaskTag.Magazzino
        case "Assistenza":
            return TaskTag.Assistenza
        case "Feedback":
            return TaskTag.Feedback
        default:
            return null
    }
}