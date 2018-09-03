"use strict";

// D3 objects
var simulation = null;
var node = null;
var nodeSel = null;

/* Panel vars */
var panel = {};
var panelLinks = {};

/* User piano selection and other buttons */
var icons = {};
var hoverIconID = -1;
var checkboxPhysics = null;
var checkboxSticky = null;

var createD3Graph = (graph) => {
	var svg = d3.select("svg");
	var width = +svg.property("viewBox").baseVal.width;
	var height = +svg.property("viewBox").baseVal.height;
	
	// Graph settings (TODO: move these elsewhere)
	const edgeWiMin = 0.5;
	const edgeWiMax = 25.0;
	const edgeWiPow = 1.0;
	const d3forces = {
		edgeStr: 0.20,
		edgeWeightExtraPull: 0.75,
		sepStr: 3000,
		driftToCenter: 0.05,
	}
	var weightScale = d3.scaleLinear().domain(d3.extent(graph.links, function(d) { return Math.pow(d.weight, d3forces.edgePow) * d3forces.edgeStr })).range([.1, 1]);
	var colScale = d3.scaleLinear()
		.domain(d3.ticks(0, 100, 1))
		.range(["#3310ef", "#10fcfc"]);
	
	// 0 = user, 1 = classical, 2 = other, 3 = chords
	var color = d3.scaleOrdinal()
		.range(["#10dcdc", "#1090fc", "#306c8c", "#c6c618"]);
	var groupRadius = (groupID) => {
		return 38 - groupID * 8;
	}


	// Clear the graph and redraw background color
	resetD3Graph(svg);

	// Save mode info
	modeDict = graph.modeDict;


	simulation = d3.forceSimulation()
		.force("link", d3.forceLink().strength(function(d){ return d3forces.edgeStr * (1.0 + d3forces.edgeWeightExtraPull * Math.pow(d.weight, 2.0)); }).id(function(d) {
			return d.id;
		}))
		/*.force("link", d3.forceLink().id(function(d) { return d.id; }))*/
		.force("charge", d3.forceManyBody().strength(-d3forces.sepStr))
		.force('x', d3.forceX(width * 0.5).strength(d3forces.driftToCenter))
		.force('y', d3.forceY(height * 0.5).strength(d3forces.driftToCenter));

	var link = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
		.attr("stroke-width", function(d) { return d.alpha * Math.pow(d.value, edgeWiPow) * (edgeWiMax - edgeWiMin) + edgeWiMin; })
		.style("stroke", function(d) { return colScale(d.value * 100.0); })
		.style("pointer-events", "none")
		.style("stroke-opacity", function(d) { return d.alpha; });

	// Sort links so larger connections drawn on top
	var links = d3.selectAll('line.link')
		.sort(function(a, b) {
			return order[a.stroke-width] > order[b.stroke-width] ? -1 : order[b.stroke-width] > order[a.stroke-width] ? 1 : 0;
		});

	// Highlight around selected node
	nodeSel = svg.append("circle")
		.attr("r", "100")
		.style("fill", "#ffbb00")
		.attr("cx", "0")
		.attr("cy", "0")
		.attr("opacity", 0);

	node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("foo")
		.data(graph.nodes)
		.enter().append("g")

	var circles = node.append("circle")
		.attr("r", function(d) { return groupRadius(d.group); })
		.style("fill", function(d) { return color(d.group); })
		.style("stroke", function(d) { return (d.type == 1) ? "#ffff00" : "#dddddd"; })
		.style("stroke-width", "2.0px");

	var labels = node.append("text")
		.text(function(d) { return d.id; })
		.attr("class", "node-labels")
		.attr("text-anchor", "middle")

	node.append("title")
		.text(function(d) { return d.id; });
			

	// Set up drag and drop
	node.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(graph.links);

	// Add panel showing selected mode
	createD3Panel(svg, width, height);
	// Add icons to left
	createD3SideIcons(svg, width, height);



	// Validate positions
	// Upper corner rect = 300x300
	var cornerWi = 250;
	var cornerHei = 250;
	var validPointX = (d) => {
		const rad = groupRadius(d.group) + 2;
		if (d.x < cornerWi + rad && d.y < cornerHei + rad && d.x > d.y) {
			return cornerWi + rad;
		} else {
			return Math.max(rad, Math.min(width - rad, d.x));
		}
	}

	var validPointY = (d) => {
		const rad = groupRadius(d.group) + 2;
		if (d.x < cornerWi + rad && d.y < cornerHei + rad && d.y > d.x) {
			return cornerHei + rad;
		} else {
			return Math.max(rad, Math.min(height - rad, d.y));
		}
	}

	function ticked() {

		node
			.attr("cx", function(d) { return validPointX(d); })
			.attr("cy", function(d) { return validPointY(d); })
			.attr("transform", function(d) { return "translate(" +
				validPointX(d) + "," +
				validPointY(d) + ")"; })

		if (nodeSel.source != null) {
			nodeSel
				.attr("cx", nodeSel.source.cx)
				.attr("cy", nodeSel.source.cy)
				.attr("transform", "translate(" +
					validPointX(nodeSel.source) + "," +
					validPointY(nodeSel.source) + ")")
				.attr("opacity", 0.67);
		}

		link
			.attr("x1", function(d) { return validPointX(d.source); })
			.attr("y1", function(d) { return validPointY(d.source); })
			.attr("x2", function(d) { return validPointX(d.target); })
			.attr("y2", function(d) { return validPointY(d.target); });

	}

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = validPointX(d);
		d.fy = validPointY(d);

		// Display on panel
		if (d.id in modeDict) {
			// Calculate analysis, if haven't yet
			// This is info like chord names
			if (modeDict[d.id].analysis == null) {
				modeDict[d.id].analysis = analyzeModeForPanel(modeDict[d.id]);
			}

			setPanelMode(modeDict[d.id]);
			nodeSel.source = d;
			nodeSel.attr("r", groupRadius(d.group) + 5);
		}

	}

	function dragged(d) {
		d.fx += d3.event.dx;
		d.fy += d3.event.dy;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		if (!allowD3Sticky) {
			d.fx = null;
			d.fy = null;
		}
	}
}

var resetD3Graph = (svg) => {
    svg.empty();
    svg.selectAll("*").remove();
    svg.append("rect").attr("x", "0").attr("y", "0").attr("width", "100%").attr("height", "100%").style("fill", "#000000");
}

var updateD3UserPianoIcon = () => {
	// Display notes correctly
	updateD3Piano(icons.piano, parseInt(rootSel), keySel);
}

var updateD3Panel = () => {
    panelLinks.title.text(panel.title);
    panelLinks.chords.text(panel.chords)
        .call(wrap, panelLinks.bounds.wi - 5);

    // Display notes
    if (panel.notes) {
        updateD3Piano(panelLinks.piano, panel.key, panel.notes);
    }
}

var updateD3Piano = (pianoLink, key, notes) => {
	for (let i = 0; i < notes.length; ++i) {
		let naturalColor = "";
		if (i == 1 || i == 3 || i == 6 || i == 8 || i == 10)
			naturalColor = "#222222";
		else
			naturalColor = "#eeeeee";

		let highlightColor = "";
		if (i == key)
			highlightColor = "#20eeaa"; // root = greenish cyan
		else if ((key + 6) % 12 == i || (key + 7) % 12 == i)
			highlightColor = "#3090dd"; // root = blueish cyan
		else
			highlightColor = "#2020ee"; // all other notes = blue


		const color = notes[i] ? highlightColor : naturalColor;

		// Set color
		pianoLink.key[i].style("fill", color);

	}
}

// User clicks on a node, and it magically appears to the right
var setPanelMode = (mode) => {
    panel.title = mode.name;
    panel.chords = mode.analysis.chordsText;
    panel.notes = mode.n;
    panel.key = mode.key;
    updateD3Panel();
}

// Get chords and such
var analyzeModeForPanel = (mode) => {
    let analysis = {};
    analysis.chords = determineChordsInMode(mode);
    analysis.chordsText = analysis.chords.join(' ');

    return analysis;
}

var createSVGPiano = (svg, panelRect, rectBorderCol, startY, internalPadding, pianoHei, vertPadding, scale) => {
    let piano = {};
    const wi = (panelRect.wi - 20) * scale;
    internalPadding *= scale;

    piano.base = svg.append("rect")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + startY)
        .attr("rx", 3 * scale)
        .attr("ry", 3 * scale)
        .attr("width", wi)
        .attr("height", pianoHei * scale)
        .style("fill", "#113388")
        .style("stroke", rectBorderCol)
        .style("pointer-events", "none");

    // Key data
    piano.key = [];
    for (let i = 0; i < 12; ++i)
        piano.key.push(null);

    // Add white keys
    const whiteWi = (wi - internalPadding * 2) / 7;
    for (let i = 0; i < 7; ++i) {

        // Map to noteID
        let noteID = 0;
        if (i == 0) noteID = 0;
        else if (i == 1) noteID = 2;
        else if (i == 2) noteID = 4;
        else if (i == 3) noteID = 5;
        else if (i == 4) noteID = 7;
        else if (i == 5) noteID = 9;
        else if (i == 6) noteID = 11;

        piano.key[noteID] = svg.append("rect")
            .attr("x", panelRect.x0 + 10 + internalPadding + whiteWi * i)
            .attr("y", panelRect.y0 + startY + 5 * scale + vertPadding)
            .attr("rx", 2 * scale)
            .attr("ry", 2 * scale)
            .attr("width", whiteWi - 1)
            .attr("height", (pianoHei - 10) * scale - vertPadding * 2)
            .style("fill", "#eeeeee")
            .style("stroke", "#101010")
            .style("pointer-events", "none");
    }

    // Add black keys over top
    const blackWi = whiteWi * 0.75;
    for (let i = 0; i < 5; ++i) {

        // Map to noteID
        let noteID = 0;
        let nearestWhite = 0;
        if (i == 0) {
            noteID = 1;
            nearestWhite = 0;
        }
        else if (i == 1) {
            noteID = 3;
            nearestWhite = 1;
        }
        else if (i == 2) {
            noteID = 6;
            nearestWhite = 3;
        }
        else if (i == 3) {
            noteID = 8;
            nearestWhite = 4;
        }
        else if (i == 4) {
            noteID = 10;
            nearestWhite = 5;
        }

        piano.key[noteID] = svg.append("rect")
            .attr("x", panelRect.x0 + 10 + internalPadding + whiteWi * nearestWhite + whiteWi * 0.5 + (whiteWi - blackWi) * 0.5)
            .attr("y", panelRect.y0 + startY + 5 * scale + vertPadding)
            .attr("rx", 2 * scale)
            .attr("ry", 2 * scale)
            .attr("width", blackWi)
            .attr("height", (pianoHei - 40) * scale - vertPadding)
            .style("fill", "#222222")
            .style("stroke", "#101010")
            .style("pointer-events", "none");
    }

    return piano;
}

// Add panel showing selected mode
// TODO: Move styles to CSS
var createD3Panel = (svg, width, height) => {
    // Settings
    const padding = 10;
    let panelRect = {
        wi: 220, hei: 400,
        };
    panelRect.x0 = width - panelRect.wi - padding;
    panelRect.y0 = padding;
    panelRect.x1 = panelRect.x0 + panelRect.wi;
    panelRect.y1 = panelRect.y0 + panelRect.hei;
    panelLinks.bounds = panelRect;

    panelLinks.rect = svg.append("rect")
        .attr("x", panelRect.x0)
        .attr("y", panelRect.y0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", panelRect.wi)
        .attr("height", panelRect.hei)
        .style("stroke", "#fff")
        .style("fill", "#5577cc");

    // MODE NAME
    panelLinks.title = svg.append("text")
        .attr("x", panelRect.x0 + panelRect.wi * 0.5)
        .attr("y", panelRect.y0 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#fff");

    // MODE PIANO
    const pianoHei = 90;
    panelLinks.piano = createSVGPiano(svg, panelRect, "#ccc", 45, 20, pianoHei - 10, 0, 1.0);

    // MODE CHORDS
    svg.append("text")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + pianoHei + 65)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#fff")
        .text("CHORDS:");
    panelLinks.chords = svg.append("text")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + pianoHei + 85)
        .attr("dy", 0)
        .attr("transform", "translate(" + (panelRect.x0 + 15).toString() + ",0)")
        .attr("text-anchor", "start")
        .attr("xml:space", "preserve")
        .style("font-size", "14px")
        .style("fill", "#fff");

    // Default info
    panel.title = "";
    panel.chords = "";

    // Display
    updateD3Panel();

}

var setCheckboxes = () => {
	if (checkboxPhysics != null) {
		checkboxPhysics.text(allowD3Physics ? "X" : "");
	}
	if (checkboxSticky != null) {
		checkboxSticky.text(allowD3Sticky ? "X" : "");
	}
}

var setIconHover = (id) => {
	if (hoverIconID != id) {
		hoverIconID = id;

		// Update display
		for (let i = 0; i < 5; ++i) {
			const icon = icons.buttons[i].icon;
			const label = icons.buttons[i].label;
			const iconBorder = icons.buttons[i].iconBorder;
			if (i == hoverIconID) {
				iconBorder.style("opacity", "0.7");
				label.style("opacity", "1.0");
			} else {
				iconBorder.style("opacity", "0.0");
				label.style("opacity", "0.5");
			}
		}
	}
}

var clickIconTrigger = function(d,i) {
	const id = d3.select(this).attr("value");
	if (id < 3) {
		setModalActive(id, true);
	} else if (id == 3) {
		setAllowD3Physics(!allowD3Physics);
		setCheckboxes();
	} else if (id == 4) {
		setAllowD3Sticky(!allowD3Sticky);
		setCheckboxes();
	}
}

var mouseOverIconTrigger = function(d,i) {
	const id = d3.select(this).attr("value");
	setIconHover(id);
}

var mouseOutIconTrigger = function(d,i) {
	const id = d3.select(this).attr("value");
	if (hoverIconID == id) {
		setIconHover(-1);
	}
}

// Add panel showing selected mode
// TODO: Move styles to CSS
var createD3SideIcons = (svg, width, height) => {
	// Settings
	const padding = 6;
	const spacingBetweenIcons = 65*0.7;
	const iconWi = 60*0.7;

	let sideRect = {
		wi: 100, hei: 400,
	};
	sideRect.x0 = padding;
	sideRect.y0 = padding;
	sideRect.x1 = sideRect.x0 + sideRect.wi;
	sideRect.y1 = sideRect.y0 + sideRect.hei;

	// Reset buttons
	icons.buttons = [];
	let labelList = [];
	let iconBorderList = [];

	// Create borders first (they are behind everything else)
	for (let i = 0; i < 3; ++i) {
		// Border for icon
		const borderWi = 2;
		const iconBorder = svg.append("rect")
			.attr("x", sideRect.x0 + 10 - borderWi)
			.attr("y", sideRect.y0 + spacingBetweenIcons * i - borderWi)
			.attr("rx", 3)
			.attr("ry", 3)
			.attr("width", iconWi + borderWi * 2)
			.attr("height", iconWi + borderWi * 2)
			.style("fill", "#fff")
			.style("pointer-events", "none")
			.attr("opacity", 0.0);
		iconBorderList.push(iconBorder);
	}
	for (let i = 3; i < 5; ++i) {
		// Border for icon
		const borderWi = 2;
		const iconBorder = svg.append("rect")
			.attr("x", sideRect.x0 + 10 - borderWi)
			.attr("y", sideRect.y0 + spacingBetweenIcons * (3 + (i - 3) * 0.5) + (i - 3) * 2 - borderWi)
			.attr("rx", 3)
			.attr("ry", 3)
			.attr("width", iconWi * 0.5 + borderWi * 2)
			.attr("height", iconWi * 0.5 + borderWi * 2)
			.style("fill", "#fff")
			.style("pointer-events", "none")
			.attr("opacity", 0.0);
		iconBorderList.push(iconBorder);
	}

	// USER PIANO
	const pianoHei = 90;
	// ARGS:      (svg, panelRect, startY, pianoHei, scale)
	icons.piano = createSVGPiano(svg, sideRect, "#667", 0, 5, pianoHei - 10, 6, 0.75*0.7);


	// PIANO ICON LABEL
	let iconLabel = svg.append("text")
		.attr("x", sideRect.x0 + iconWi + 20)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 0 + 20)
		.attr("text-anchor", "start")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("Change input notes");
	labelList.push(iconLabel);

	

	// SETTINGS ICON (placeholder)
	svg.append("rect")
		.attr("x", sideRect.x0 + 10)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 1)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", iconWi)
		.attr("height", iconWi)
		.attr("fill", "#113388")
		.attr("stroke", "#667");

	// SETTINGS ICON LABEL
	iconLabel = svg.append("text")
		.attr("x", sideRect.x0 + iconWi + 20)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 1 + 20)
		.attr("text-anchor", "start")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("Change algorithm settings");
	labelList.push(iconLabel);



	// INSTRUCTIONS ICON (placeholder)
	svg.append("rect")
		.attr("x", sideRect.x0 + 10)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 2)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", iconWi)
		.attr("height", iconWi)
		.attr("fill", "#113388")
		.attr("stroke", "#667");

	// INSTRUCTIONS ICON LABEL
	iconLabel = svg.append("text")
		.attr("x", sideRect.x0 + iconWi + 20)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 2 + 20)
		.attr("text-anchor", "start")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("Instructions");
	labelList.push(iconLabel);

	// PHYSICS TOGGLE - BUTTON
	svg.append("rect")
		.attr("x", sideRect.x0 + 10)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", iconWi * 0.5)
		.attr("height", iconWi * 0.5)
		.attr("fill", "#113388")
		.attr("stroke", "#667");

	// PHYSICS TOGGLE - CHECK MARK
	checkboxPhysics = svg.append("text")
		.attr("x", sideRect.x0 + iconWi * 0.5)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3 + iconWi * 0.35)
		.attr("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("X");

	// PHYSICS TOGGLE - LABEL
	iconLabel = svg.append("text")
		.attr("x", sideRect.x0 + iconWi + 5)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3 + 14)
		.attr("text-anchor", "start")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("(Placeholder)");
	labelList.push(iconLabel);

	// STICKY TOGGLE - BUTTON
	svg.append("rect")
		.attr("x", sideRect.x0 + 10)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3.5 + 2)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", iconWi * 0.5)
		.attr("height", iconWi * 0.5)
		.attr("fill", "#113388")
		.attr("stroke", "#667");

	// STICKY TOGGLE - CHECK MARK
	checkboxSticky = svg.append("text")
		.attr("x", sideRect.x0 + iconWi * 0.5)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3.5 + iconWi * 0.35 + 2)
		.attr("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("X");

	// STICKY TOGGLE - LABEL
	iconLabel = svg.append("text")
		.attr("x", sideRect.x0 + iconWi + 5)
		.attr("y", sideRect.y0 + spacingBetweenIcons * 3.5 + 14 + 2)
		.attr("text-anchor", "start")
		.style("font-size", "14px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.5)
		.text("Sticky Nodes");
	labelList.push(iconLabel);

	

	// Store as list of buttons
	// and attach actions
	for (let i = 0; i < 3; ++i) {
		let textWi = 130;
		if (i == 0) {
			textWi = 130;
		} else if (i == 1) {
			textWi = 170;
		} else if (i == 2) {
			textWi = 90;
		}
		
		// Create rectangle to trigger mouseovers and clicks
		const iconRect = svg.append("rect")
			.attr("x", sideRect.x0 + 10)
			.attr("y", sideRect.y0 + spacingBetweenIcons * i)
			.attr("width", iconWi)
			.attr("height", iconWi)
			.attr("fill", "#fff")
			.attr("value", i)
			.attr("opacity", 0)
				.on("click", clickIconTrigger)
				.on("mouseover", mouseOverIconTrigger)
				.on("mouseout", mouseOutIconTrigger);

		const labelRect = svg.append("rect")
			.attr("x", sideRect.x0 + iconWi + 10)
			.attr("y", sideRect.y0 + spacingBetweenIcons * i)
			.attr("width", textWi)
			.attr("height", 30)
			.attr("fill", "#fff")
			.attr("value", i)
			.attr("opacity", 0.0) // set to 0.5 whenever change labels
				.on("click", clickIconTrigger)
				.on("mouseover", mouseOverIconTrigger)
				.on("mouseout", mouseOutIconTrigger);

		icons.buttons.push({ 'iconBorder': iconBorderList[i], 'trigger0': iconRect, 'trigger1': labelRect, 'label': labelList[i] })
	}

	// Store toggles
	for (let i = 3; i < 5; ++i) {
		let textWi = 130;
		if (i == 3) {
			textWi = 110;
		} else if (i == 4) {
			textWi = 145;
		}

		// Create rectangle to trigger mouseovers and clicks
		const iconRect = svg.append("rect")
			.attr("x", sideRect.x0 + 10)
			.attr("y", sideRect.y0 + spacingBetweenIcons * (3 + (i - 3) * 0.5) + (i - 3) * 2)
			.attr("width", iconWi * 0.5)
			.attr("height", iconWi * 0.5)
			.attr("fill", "#fff")
			.attr("value", i)
			.attr("opacity", 0)
				.on("click", clickIconTrigger)
				.on("mouseover", mouseOverIconTrigger)
				.on("mouseout", mouseOutIconTrigger);

		const labelRect = svg.append("rect")
			.attr("x", sideRect.x0 + iconWi * 0.5 + 10)
			.attr("y", sideRect.y0 + spacingBetweenIcons * (3 + (i - 3) * 0.5) + (i - 3) * 2)
			.attr("width", textWi)
			.attr("height", 20)
			.attr("fill", "#fff")
			.attr("value", i)
			.attr("opacity", 0.0) // set to 0.5 whenever change labels
				.on("click", clickIconTrigger)
				.on("mouseover", mouseOverIconTrigger)
				.on("mouseout", mouseOutIconTrigger);
		icons.buttons.push({ 'iconBorder': iconBorderList[i], 'trigger0': iconRect, 'trigger1': labelRect, 'label': labelList[i] })
	}

	updateD3UserPianoIcon();
	setCheckboxes();

}

// SOURCE: https://bl.ocks.org/mbostock/7555321
// Released under the GNU General Public License, version 3.
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.35, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        words.shift();

        while (word = words.pop()) {
            if (word != 'NL,' && word != 'NL' || 1 == 1) {
                line.push(word);
                tspan.text(line.join("   "));
            }

            if (tspan.node().getComputedTextLength() > width || word == 'NL,' || word == 'NL') {
                line.pop();
                tspan.text(line.join("   "));
                if (word != 'NL,' && word != 'NL') {
                    line = [word];
                } else {
                    line = [];
                }
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }

    });
}
