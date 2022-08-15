export class Paging{
    currentPageSize: number
    prevDisabled: boolean = true
    nextDisabled: boolean = false
    page: number = 1
    pageSize: number = 3
    asc: boolean = true
    sortBy: string = "id"
    search: string = ""
    maxPages: number = 0
    entryCount: number = 0
  
  
    constructor(){
      this.currentPageSize = this.pageSize
    }
  
    init(){
      this.conductSearch()
    }
  
    pageChanged(event:any ){    
      if(event.target.value === '' || this.page < 1){
        this.page = 1
        return
      }
      if(this.page > this.maxPages) {
        this.page = this.maxPages
        return
      }
      this.checkButtons()
      this.page = event.target.value
      this.conductSearch()  
    }
  
  
    searchChanged(event:any ){
      console.log(event.target.value)
      this.search = event.target.value
      this.conductSearch()   
    }
  
    sortByChanged(event:any){
      console.log(event.target.value);
      this.sortBy = event.target.value
      this.conductSearch()  
    }
  
    ascChanged(event:any){
      this.asc = event.target.value
      this.conductSearch()  
    }
  
    changePage(back:boolean):void{
      if(back) this.page--
      else this.page++
      this.checkButtons()
      this.conductSearch()  
    }

    firstPage(){
      this.page = 1
      this.checkButtons()
      this.conductSearch()
    }

    lastPage(){
      this.page = this.maxPages
      this.checkButtons()
      this.conductSearch()
    }
  
    changePageSize(event:any){
      if(event.target.value < 0) return
      else{
        this.pageSize = event.target.value
        this.maxPages = Math.ceil(this.entryCount / this.pageSize)
        this.page = 1
        console.log(this.maxPages, this.pageSize, this.entryCount);
        
        this.checkButtons()
        this.conductSearch()}
    }
  
    checkButtons(){
      this.prevDisabled = this.page <= 1
      this.nextDisabled = this.page >= this.maxPages || this.maxPages == Infinity
    }
  
    conductSearch(){}
  
  }