var NavigationItems = function (categories, demoContent) {
    var self = this;
    this.categories = categories;
    this.demoContent = demoContent;
    this.activeItem = ko.observable(null);
    this.activeItemName = ko.computed(function () { return this.activeItem() != null ? this.activeItem().name : ''; }, this);
    this.activeItemDescription = ko.computed(function () { return this.activeItem() != null ? this.activeItem().description: ''; }, this);

    this.itemClicked = function (item) {
        self.activeItem(item);
        if (item && self.demoContent) {
            self.demoContent.innerHTML = '<object id= type="type/html" style="height:100%; width:100%" data="' + item.href +'"></object>'
        }
    }
}