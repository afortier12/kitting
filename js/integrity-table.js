window.addEventListener("load", function(event) {
	if (navigator.appVersion.indexOf("Mac") != -1) {
		// If a scroll bar is not taking up space in element...
		if($(".int-table-body").width() == $(".int-table-body>.int-table-row").width()){
			$(".int-table-header").css("padding-right", "0px")
		} else {
			$(".int-table-header").css("padding-right", "15px")
		}
	} else if (navigator.appVersion.indexOf("X11") != -1) {
		// If user is using X11, adjust padding width
		$(".int-table-header").css("padding-right", "12px")
	}

})

Vue.component('integrity-table', {
	props: ['name', 'collection', 'columns'],
	watch: {
		collection(newValue){
			this.fields = Object.keys(newValue[0])
			this.mainCollection = newValue
			this.filterOptions = {}
			for(var k in this.columns){
				for(var i in newValue){
					if(!this.filterOptions[this.columns[k]]){
						this.filterOptions[this.columns[k]] = new Set()
					}
					this.filterOptions[this.columns[k]].add(newValue[i][this.fields[k]])
				}
				if(typeof(newValue[0][this.fields[k]]) == "string"){
					this.filterOptions[this.columns[k]] = Array.from(this.filterOptions[this.columns[k]]).sort()
				} else {
					this.filterOptions[this.columns[k]] = Array.from(this.filterOptions[this.columns[k]])
				}
			}
		}
	},
	components: {
		"vue-multiselect": window.VueMultiselect.default,
	},
	data(){
		return {
			pagingCount: 50,
			pagingIndex: 0,
			search: "",
			asc: true,
			order: 0,
			filterToggle: false,
			fields: [],
			mainCollection: [],
			filters: {},
			filterOptions: {"nocolumn": new Set()},
			selectedFilterColumn: "nocolumn"
		}
	},
	computed: {
		pagingText(){
			return `Page ${this.pagingIndex + 1} of ${Math.ceil(this.filteredCount / this.pagingCount)}`
		},
		filteredCount(){
			let count = 0
			for(var i in this.mainCollection){
				if(this.filter(this.mainCollection[i])){
					count++
				}
			}
			if(Math.ceil(count / this.pagingCount) <= this.pagingIndex){
				this.pagingIndex = Math.ceil(count / this.pagingCount) - 1
			}
			if(this.pagingIndex < 0){
				this.pagingIndex = 0
			}
			return count
		},
		ofTotal(){
			return this.mainCollection.length
		},
		startCount(){
			return this.pagingIndex * this.pagingCount
		},
		endCount(){
			let end = ((this.pagingIndex + 1) * this.pagingCount)
			let len = this.filteredCount
			end = end > len ? len : end
			return end
		},
		summaryText(){
			return `Records ${this.startCount + 1} to ${this.endCount} from ${this.filteredCount} filtered ( ${this.ofTotal} total records )`
		}
	},
	methods: {
		pagination(index){
			let start = this.startCount
			let end = this.endCount
			if(index < start || index >= end){
				return false
			}
			return true
		},
		filter(item){
			for(var i in this.columns){
				if(this.filters[this.columns[i]] && this.filters[this.columns[i]].length > 0){
					if(this.filters[this.columns[i]].indexOf(item[this.fields[i]]) == -1) {
						return false
					}
				}
			}
			if(this.search != ""){
				let search = this.search.toLowerCase()
				for(var i in item){
					if(item[i] && (item[i] == search || (typeof(item[i]) == "string" && item[i].toLowerCase().indexOf(search) > -1))){
						return true
					}
				}
				return false
			}
			return true
		},
		filtered(){
			let items = []
			for(var i in this.mainCollection){
				if(this.filter(this.mainCollection[i])){
					items.push(this.mainCollection[i])
				}
			}
			return items
		},
		setOrder(num){
			this.order = num
			if(this.asc){
				this.mainCollection = _.chain(this.mainCollection).sortBy(`column${num}`).value().reverse()
			} else {
				this.mainCollection = _.chain(this.mainCollection).sortBy(`column${num}`).value()
			}
			this.asc = !this.asc
		},
		sortClass(){
			return 'fas fa-sort-amount-' + (this.asc ? 'up' : 'down')
		},
		previousButtonClass(){
			return 'btn btn-primary' + (this.pagingIndex == 0 ? ' disabled' : '')
		},
		previousButtonClick(){
			if(this.pagingIndex > 0){
				this.pagingIndex -= 1
			}
		},
		nextButtonClass(){
			return 'btn btn-primary' + (this.pagingIndex + 1 == Math.ceil(this.filteredCount / this.pagingCount) ? ' disabled' : '')
		},
		nextButtonClick(){
			if((this.pagingIndex + 1 < Math.ceil(this.filteredCount / this.pagingCount) ? ' disabled' : '')){
				this.pagingIndex += 1
			}
		},
		cellStyleClass(item, field){
			if(this.$parent.cellStyleClass){
				return this.$parent.cellStyleClass(item, field)
			} else {
				return ""
			}
		},
		colWidthClass(field){
			if(this.$parent.colWidthClass){
				return this.$parent.colWidthClass(field)
			} else {
				return "int-table-width-1"
			}
		},
		activeFilterCount(item){
			if(this.filters[item] && this.filters[item].length > 0){
				return `(${this.filters[item].length} active)`
			} else {
				return "(Not active)"
			}
		},
		limitText(count){
			return "(" + count + ") selected"
		},
		resetFilters(){
			this.filters = {}
		},
		select(item){
			this.$emit('select', item)
		}
	},
	mounted(){
		this.fields = Object.keys(this.collection[0])
		this.mainCollection = this.collection
		this.filterOptions = {}
		for(var k in this.columns){
			for(var i in this.collection){
				if(!this.filterOptions[this.columns[k]]){
					this.filterOptions[this.columns[k]] = new Set()
				}
				this.filterOptions[this.columns[k]].add(this.collection[i][this.fields[k]])
			}
			if(typeof(this.collection[0][this.fields[k]]) == "string"){
				this.filterOptions[this.columns[k]] = Array.from(this.filterOptions[this.columns[k]]).sort()
			} else {
				this.filterOptions[this.columns[k]] = Array.from(this.filterOptions[this.columns[k]])
			}
		}
	},
	template: "#integrity-table"
})