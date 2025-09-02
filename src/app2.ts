abstract class DocumentItemState {
    public name: string
    protected item: DocumentItem

    constructor(){
        this.name = ''
        this.item = new DocumentItem('')
    }
    public setContext(item: DocumentItem){
        this.item = item
    }

    public abstract publish(): void
}

class DraftState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
        this.item.setState(new ModerateState())
    }


}

class ModerateState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
        this.item.setState(new PublishedState())
    }


}


class PublishedState extends DocumentItemState {
    constructor(){
        super()
        this.name = 'Draft'
    }
    publish(): void {
      console.log('Document published')
    }


}

const item = new DocumentItem('Hello')
item.getState().publish()
item.getState().publish()   
item.getState().name