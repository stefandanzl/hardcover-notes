
export function add(a: number, b: number):number{
    if (a ===undefined || b === undefined ){
        throw new Error("missing input value")
    }
    return a + b
}


