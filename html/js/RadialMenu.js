'use strict';

function RadialMenu(params) {
    this.parent = params.parent;
    this.menuItems = params.menuItems || [];
    this.onClick = params.onClick;
    this.closeOnClick = params.closeOnClick;

    this.container = null;
}

RadialMenu.prototype.open = function () {
    this.container = document.createElement('div');
    this.container.id = "menuGrid";

    this.renderMenu(this.menuItems);

    this.parent.innerHTML = "";
    this.parent.appendChild(this.container);
};

RadialMenu.prototype.renderMenu = function (items, isNested = false) {
    let self = this;
    items = items.filter(item => item.title !== "More");
    self.container.innerHTML = "";

    const radius = 180; // КОЛКО ДАЛЕЧ ОТ СРЕДАТА
    const total = items.length;

items.forEach((item, index) => {
let label = document.getElementById("menuCenterLabel");

    let angle = (index / total) * (2 * Math.PI);

    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;

    let el = self.createItem(item);

    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "50%";
el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(var(--scale))`;
    
el.onmouseover = function () {

    if (label) {
        label.innerHTML = item.title;
    }
};

el.onmouseout = function () {
    if (label) {
        label.innerHTML = "";
    }
};
el.onclick = function () {
    if (item.items) {
        showSubMenu(item.items);
        return;
    }

    if (self.onClick) self.onClick(item);
};

    self.container.appendChild(el);
});
    if (isNested) {
        let back = self.createItem({
            title: "Back",
            icon: "#return"
        }, true);

        back.style.position = "absolute";
        back.style.left = "50%";
        back.style.top = "50%";
        back.style.transform = "translate(-50%, -50%)";

        back.onclick = function () {
            self.renderMenu(self.menuItems);
        };

        self.container.appendChild(back);
    }

};
RadialMenu.prototype.createItem = function (item, isBack = false) {
    let div = document.createElement("div");
    div.className = "menuItem";

    // ICON
    if (item.icon) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "menuIconSvg");
        svg.setAttribute("viewBox", "0 0 100 100");

        let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", item.icon);

        svg.appendChild(use);
        div.appendChild(svg);
    }


    return div;
};

RadialMenu.prototype.close = function () {
    if (this.parent) {
        this.parent.innerHTML = "";
    }

    let sub = document.getElementById("subMenu");
    if (sub) sub.innerHTML = "";

    let label = document.getElementById("menuCenterLabel");
    if (label) label.innerHTML = "";
};
RadialMenu.prototype.destroy = function () {
    this.close();
};
function showSubMenu(items) {
    let sub = document.getElementById("subMenu");
    if (!sub) return;

        sub.innerHTML = "";

    let count = items.length;
    let columns = 5;

    if (count > 15) {
        columns = 7;
    }

    sub.style.gridTemplateColumns = `repeat(${columns}, 70px)`;

    items.forEach(subItem => {
        let div = document.createElement("div");
        div.className = "subItem";

        if (subItem.icon) {
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "menuIconSvg");
            svg.setAttribute("viewBox", "0 0 100 100");

            let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", subItem.icon);

            svg.appendChild(use);
            div.appendChild(svg);
        }

        let label = document.getElementById("menuCenterLabel");

        div.onmouseover = function () {
            if (label) {
                label.innerHTML = subItem.title;
            }
        };

        div.onmouseout = function () {
            if (label) {
                label.innerHTML = "";
            }
        };
div.onclick = function () {
    $.post(`https://${window.resourceName}/triggerAction`, JSON.stringify({
        action: subItem.functionName || subItem.event || subItem.id,
        parameters: subItem.parameters || {},
        eventType: subItem.eventType || "client"
    }));

    sub.innerHTML = "";

    $.post(`https://${window.resourceName}/closemenu`);
};

        sub.appendChild(div);
    });
}