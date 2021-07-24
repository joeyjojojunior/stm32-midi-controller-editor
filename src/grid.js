var Grid = {
    content: [],
    grid: {},
    firstRun: true,

    initContent: function () {
        var content = [];
        for (var i = 0; i < NUM_KNOBS; i++) {
            var gridItem = document.createElement("div");
            gridItem.className = "item";
            gridItem.id = `item${i}`;
            gridItem.addEventListener('click', Grid.eventClick);

            var gridItemContent = document.createElement("div");
            gridItemContent.className = "item-content";
            gridItemContent.id = `item-content${i}`;

            gridItem.appendChild(gridItemContent);
            content[i] = gridItem;
        }
        return content;
    },

    layout: function (grid, layoutId, items, width, height, callback) {
        var layout = {
            id: layoutId,
            items: items,
            slots: [],
            styles: {},
        };

        var item;
        var m;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;

        var maxW = width / 2;
        var currentW = 0;
        var currentRowH = 0;
        var currentRowW = 0;
        var rowSizes = [];
        var rowFixes = [];

        var xPre, yPre, wPre, hPre;
        var numToFix = 0;

        for (var i = 0; i < items.length; i++) {
            item = items[i];

            m = item.getMargin();
            wPre = item.getWidth() + m.left + m.right;
            hPre = item.getHeight() + m.top + m.bottom;
            xPre += wPre;

            if (hPre > currentRowH) {
                currentRowH = hPre;
            }

            if (w < currentRowW) {
                currentRowW = wPre;
            }

            rowSizes.push(width / 2);
            numToFix++;
            currentW += wPre;

            var k = 0;

            for (var j = 0; j < numToFix; j++) {
                rowSizes[i - j] -= wPre / 2;
            }

            if (numToFix > 1) {
                rowSizes[i] -= (wPre / 2) * (numToFix - 1);
                k += (wPre / 2);
            }

            currentW -= k;
            rowFixes.push(k);

            if (currentW >= maxW) {
                yPre += currentRowH;
                currentRowH = 0;
                xPre = 0;
                numToFix -= 1;
                currentW = 0;
                numToFix = 0;
                k = 0;
            }
        }

        maxW = width / 2;
        currentW = 0;
        currentRowH = 0;
        currentRowW = 0;

        for (var i = 0; i < items.length; i++) {
            item = items[i];
            x += w;

            if (h > currentRowH) {
                currentRowH = h;
            }

            if (w < currentRowW) {
                currentRowW = w;
            }

            currentW += w - rowFixes[i];

            if (currentW >= maxW) {
                y += currentRowH;
                currentRowH = 0;
                x = 0;
                currentW = 0;
            }

            m = item.getMargin();
            w = item.getWidth() + m.left + m.right;
            h = item.getHeight() + m.top + m.bottom;
            layout.slots.push(x + rowSizes[i], y);
        }

        layout.styles.width = '100%';
        layout.styles.height = y + h + 1 + 'px';

        callback(layout);
    },

    gridOptions: function (content) {
        return {
            items: content,
            dragEnabled: true,
            dragSortHeuristics: {
                sortInterval: 200,
                minDragDistance: 20,
                minBounceBackAngle: 1
            },
            dragStartPredicate: {
                delay: 100,
                distance: 10
            },
            dragSortPredicate: {
                threshold: 50,
                action: 'swap',
                migrateAction: 'move'
            },
            layout: Grid.layout
        };
    },

    eventClick: function (e) {
        var newKnobID = (e.target.id.match(/\d+/g) || []).map(n => parseInt(n))[0];
        Controller.selectKnob(newKnobID);


        /*
        if (currKnobID !== newKnobID) {
            var ktContainer = document.querySelector(".knob-top-container");
            ktContainer.classList.add("fade-out-fast");
            setTimeout(() => {
                ktContainer.classList.add("fade-in-fast");
            }, 200);
            ktContainer.classList.remove("fade-in-fast");

            cacheKnob(currKnobID);
            activateItem(newKnobID);
            currKnobID = newKnobID;
        }
        */
    },

    eventMove: function (data) {
        var movedItem = data.item;
        var swappedItem = Grid.grid.getItem(data.fromIndex);
        var temp = movedItem._id;
        var movedIndex = data.fromIndex;
        var swappedIndex = data.toIndex;

        movedItem._id = swappedItem._id;
        swappedItem._id = temp;

        movedGridItem = document.getElementById(`item${movedIndex}`);
        swappedGridItem = document.getElementById(`item${swappedIndex}`);
        movedGridItem.id = `item${swappedIndex}`;
        swappedGridItem.id = `item${movedIndex}`;

        movedGridItemContent = document.getElementById(`item-content${movedIndex}`);
        swappedGridItemContent = document.getElementById(`item-content${swappedIndex}`);
        movedGridItemContent.id = `item-content${swappedIndex}`;
        swappedGridItemContent.id = `item-content${movedIndex}`;

        //updateKnobContent(movedIndex);
        //updateKnobContent(swappedIndex);

        // If we moved the current knob, update the saved index and re-show it
        if (movedGridItem.classList.contains("active")) {
            Controller.selectKnob(swappedIndex);
        }
    },

    eventDragMove: function (item, event) {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].removeEventListener("click", Grid.eventClick);
        }
    },

    eventDragReleaseEnd: function (item, event) {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].addEventListener("click", Grid.eventClick);
        }
    },

    eventLayoutEnd: function () {
        if (Grid.firstRun) {
            console.log("firstRun true");
            console.log("layoutEnd");
            Grid.grid.move(0, 1);
            Grid.grid.move(1, 0);
            Grid.firstRun = false;
        }
    },

    update: function () {
        for (var i = 0; i < Grid.content.length; i++) {
            Grid.content[i].firstChild.innerHTML = Knobs.content[i];
        }
    },

    select: function (id) {
        var gridItemOld = document.getElementById(`item${Knobs.currID}`);
        var gridItemNew = document.getElementById(`item${id}`);
        Grid.content[id].firstChild.innerHTML = Knobs.content[id];
        gridItemOld.classList.remove("active");
        gridItemNew.classList.add("active");
    },

    init: function () {
        Grid.content = Grid.initContent();
        Grid.grid = new Muuri('.grid', Grid.gridOptions(Grid.content));
        Grid.grid.on('click', Grid.eventClick);
        Grid.grid.on('move', Grid.eventMove);
        Grid.grid.on('dragMove', Grid.eventDragMove);
        Grid.grid.on('dragReleaseEnd', Grid.eventDragReleaseEnd);
        Grid.grid.on('layoutEnd', Grid.eventLayoutEnd);
        Grid.grid.layout();
        Grid.update();

        // Keeps grid item text in its container
        jQuery(".item-content").fitText(0.87);
    }
}