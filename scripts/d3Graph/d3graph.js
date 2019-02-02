"use strict";

// Settings
var palette_Edges = ["#91340d", "#91340d", "#23c5fc", "#23c5fc"];
var palette_NodeGroups = ["#55d339", "#308cc1", "#994c20"];
var palette_NodeGroups_Faded = ["rgba(85, 211, 57, 0.3)", "rgba(48, 140, 193, 0.3)", "rgba(153, 76, 32, 0.3)"];

	// 0 = user
	// 1 = medieval
	// 2 = modified medieval / composer
	// 3 = blues / experimental (prev: #994c20)
	// 4 = world (prev: #7c22a3)
	// 5 = chord / film / invented
var palette_ModeTypes = ["#51d633", "#2191d1", "#2856d6", "#9b30d1", "#ce3227", "#cecb4b"];
// ["#3310ef", "#10fcfc"];
// ["#10dcdc", "#1090fc", "#306c8c", "#c6c618"];

var cornerWi = 180;
var cornerHei = 100;
var rightMenuWi = 290;
var userModeExtraRadius = 9;

// D3 objects
var simulation = null;
var node = null;
var nodeSel = null;

/* Panel vars */
var panel = {};
var panelLinks = {};

/* User piano selection and other buttons */
var activeSVG = {};
var hoverIconID = -1;
var checkboxPhysics = null;
var checkboxSticky = null;

// On page load, add listener to resize
window.addEventListener('resize', resize);

var resize = () => {
	console.log(window.innerWidth);
}

var createD3Graph = (graph, defaultSelection) => {
	var svg = d3.select("svg");
	var width = +svg.property("viewBox").baseVal.width;
	var height = +svg.property("viewBox").baseVal.height;
	
	// Graph settings (TODO: move these elsewhere)
	const edgeWiMin = 0.5;
	const edgeWiMax = 25.0;
	const edgeWiPow = 1.0;
	const d3forces = {
		edgeStr: 0.50,
		edgeWeightExtraPull: 0.75,
		sepStr: 1500,
		driftToCenter: 0.05,
	}
	var weightScale = d3.scaleLinear().domain(d3.extent(graph.links, function(d) { return Math.pow(d.weight, d3forces.edgePow) * d3forces.edgeStr })).range([.1, 1]);
	var colScale = d3.scaleLinear()
		.domain(d3.ticks(0, 100, 4))
		.range(palette_Edges);
	
	// 0 = user, 1 = classical, 2 = other, 3 = chords
	var color = d3.scaleOrdinal()
		.range(palette_NodeGroups);

	var colorType = d3.scaleOrdinal()
		.range(palette_ModeTypes);

	var colorFaded = d3.scaleOrdinal()
		.range(palette_NodeGroups_Faded);

	var impactRadius = (impact, type) => {
		const addToRadius = (type === 0) ? userModeExtraRadius : 0;
		if (impact != null) {
			if (impact < 0.0) impact = 0.0;
			if (impact > 1.0) impact = 1.0;
			return 4 + 36 * impact + addToRadius;
		} else {
			return 36 + addToRadius;
		}
	}
	var impactFontSize = (impact) => {
		if (impact != null) {
			if (impact < 0.0) impact = 0.0;
			if (impact > 1.0) impact = 1.0;
			return (4 + 17 * impact).toString() + "px";
		} else {
			return "15px";
		}
	}
	var borderColor = (type) => {
		switch (type) {
			case 0:
			case 2:
				return "#dddddd";
			case 1:
				return "#ffff00";
			case 3:
			default:
				return "#dddddd";
		}
	}
	var getFillColor = (group, type) => {
		if (group === 0) {
			return palette_ModeTypes[0];
		} else {
			return palette_ModeTypes[type + 1];
		}
	}


	// Clear the graph and redraw background color
	resetD3Graph(svg);

	// Save mode info
	modeDict = graph.modeDict;

	simulation = d3.forceSimulation()
		//.force("link", d3.forceLink().strength(function(d){ return d3forces.edgeStr * (1.0 + d3forces.edgeWeightExtraPull * Math.pow(d.weight, 2.0)); }).id((d) => { return d.id; }))
		.force("link", d3.forceLink()
			.id((d) => { return d.id; })
			.strength((d) => { return d3forces.edgeStr * (d.edgeStrMult || 1.0); })
			.distance((d) => { return 200 * (d.edgeDistMult || 1.0); } ))
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
		.attr("class", "nodeSelection")
		.attr("r", "100")
		.attr("cx", "0")
		.attr("cy", "0")
		.attr("opacity", 0);

	// Add nodes to SVG
	node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("nodelist")
		.data(graph.nodes)
		.enter().append("g");

	// Bind drag and drop functions
	node.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	// Attach circles to nodes to make them visible
	// Circle colors and sizes are determined by node groups
	node.append("circle")
		.attr("class", "node-circles")
		.attr("r", (d) => { return impactRadius(d.impact, d.type); })
		.style("fill", (d) => { return getFillColor(d.group, d.type); })
		.style("stroke", "#dddddd")
		.style("-webkit-filter", (d) => { return "drop-shadow(0px 0px " + (4 + 4 * d.impact).toString() + "px " + colorFaded(d.group); } ) // Set subtle glow
		.style("-filter", (d) => { return "drop-shadow(0px 0px " + (4 + 4 * d.impact).toString() + "px " + colorFaded(d.group); } );

	// Add labels to nodes
	node.append("text")
		.attr("class", "node-labels")
		.style("font-size", (d) => { return impactFontSize(d.impact); })
		.text((d) => { return d.id; });

	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(graph.links);

	// Add panel showing selected mode
	createD3Panel(svg, width, height);
	// Add icons to left
	createD3SideIcons(svg, width, height);

	// Set default mode
	if (defaultSelection != null) {
		if (modeDict[defaultSelection].analysis == null) {
			modeDict[defaultSelection].analysis = analyzeModeForPanel(modeDict[defaultSelection]);
		}
		setPanelMode(graph.modeDict[defaultSelection]);
		nodeSel.source = null;
		nodeSel.attr("r", impactRadius(1.0) + userModeExtraRadius);
	}



	// Validate positions
	// Upper corner rect = 300x300
	var validatePointX = (d) => {
		const rad = impactRadius(d.impact) + 2;
		if (d.x < cornerWi + rad && d.y < cornerHei + rad && d.x > d.y) {
			return cornerWi + rad;
		} else {
			return Math.max(rad, Math.min(width - rad - rightMenuWi, d.x));
		}
	}

	var validatePointY = (d) => {
		const rad = impactRadius(d.impact) + 2;
		if (d.x < cornerWi + rad && d.y < cornerHei + rad && d.y > d.x) {
			return cornerHei + rad;
		} else {
			return Math.max(rad, Math.min(height - rad, d.y));
		}
	}

	function ticked() {

		node
			.attr("cx", function(d) { return validatePointX(d); })
			.attr("cy", function(d) { return validatePointY(d); })
			.attr("transform", function(d) { return "translate(" +
				validatePointX(d) + "," +
				validatePointY(d) + ")"; })

		if (nodeSel.source != null) {
			nodeSel
				.attr("cx", nodeSel.source.cx)
				.attr("cy", nodeSel.source.cy)
				.attr("transform", "translate(" +
					validatePointX(nodeSel.source) + "," +
					validatePointY(nodeSel.source) + ")")
				.attr("opacity", 1.0);
		}

		link
			.attr("x1", function(d) { return validatePointX(d.source); })
			.attr("y1", function(d) { return validatePointY(d.source); })
			.attr("x2", function(d) { return validatePointX(d.target); })
			.attr("y2", function(d) { return validatePointY(d.target); });

	}

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = validatePointX(d);
		d.fy = validatePointY(d);

		// Display on panel
		if (d.id in modeDict) {
			// Calculate analysis, if haven't yet
			// This is info like chord names

			//console.log("Selected " + d.id);
			if (modeDict[d.id].analysis == null) {
				modeDict[d.id].analysis = analyzeModeForPanel(modeDict[d.id]);
			}

			setPanelMode(modeDict[d.id]);
			nodeSel.source = d;
			nodeSel.attr("r", impactRadius(d.impact));
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
	panel.chords = mode.analysis.chords;
	panel.chordsByTonic = mode.analysis.chordsByTonic;
	panel.cadences = mode.analysis.cadences;
	panel.notes = mode.n;
	panel.key = mode.key;
	updateD3Panel();
}

// Get chords and such
var analyzeModeForPanel = (mode) => {
	let analysis = {};

	const res = getChordAnalysis(mode);
	analysis.chords = res.chords;
	analysis.chordsByTonic = res.chordsByTonic;
	analysis.cadences = res.cadences;

	return analysis;
}

var updateD3Panel = () => {
	//console.log(panel.chordsByTonic);
	panelLinks.title.text(panel.title);
	//console.log(panel.cadences);

	if (panel.chordsByTonic) {
		let i = 0;
		for (i = 0; i < panel.chordsByTonic.length; ++i) {
			panelLinks.chords[i].text(panel.chordsByTonic[i].join('  '));
		}
		for (; i < panelLinks.chords.length; ++i) {
			panelLinks.chords[i].text('');
		}
	}

	if (panel.cadences) {
		let i = 0;
		for (i = 0; i < panel.cadences.length; ++i) {
			panelLinks.cadences[i].text(panel.cadences[i]);
		}
		for (; i < panelLinks.cadences.length; ++i) {
			panelLinks.cadences[i].text('');
		}
	}

	// Display notes
	if (panel.notes) {
		updateD3Piano(panelLinks.piano, panel.key, panel.notes);
	}

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
		.style("fill", "rgba(17, 51, 136, 0.3)")
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
			.attr("class", "svg-piano-key")
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
			.attr("class", "svg-piano-key")
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
	const panelRect = {
		wi: 220 * 1.2,
		hei: height * 0.9,
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
		.style("fill", "rgba(85, 119, 204, 0.11)");

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
	
	// Chord text
	panelLinks.chords = []
	for (let i = 0; i < 12; ++i) {
		const newLabel = svg.append("text")
			.attr("x", panelRect.x0 + 20)
			.attr("y", panelRect.y0 + pianoHei + 85 + 20 * i)
			.attr("dy", 0)
			//.attr("transform", "translate(" + (panelRect.x0 + 15).toString() + ",0)")
			.attr("text-anchor", "start")
			.attr("xml:space", "preserve")
			.style("font-size", "14px")
			.style("fill", "#fff");

		panelLinks.chords.push(newLabel);

	}

	// MODE CADENCES
	svg.append("text")
		.attr("x", panelRect.x0 + 10)
		.attr("y", panelRect.y0 + pianoHei + 330)
		.attr("text-anchor", "start")
		.style("font-size", "16px")
		.style("font-weight", "bold")
		.style("fill", "#fff")
		.text("SUGGESTED CADENCES:");
	
	// Chord text
	panelLinks.cadences = []
	for (let i = 0; i < 8; ++i) {
		const newLabel = svg.append("text")
			.attr("x", panelRect.x0 + 20)
			.attr("y", panelRect.y0 + pianoHei + 350 + 20 * i)
			.attr("dy", 0)
			//.attr("transform", "translate(" + (panelRect.x0 + 15).toString() + ",0)")
			.attr("text-anchor", "start")
			.attr("xml:space", "preserve")
			.style("font-size", "14px")
			.style("fill", "#fff");

		panelLinks.cadences.push(newLabel);

	}

	// Default info
	panel.title = "";
	panel.chords = "";

	// Display
	updateD3Panel();

}

var setIconHover = (id) => {
	if (hoverIconID != id) {
		hoverIconID = id;

		// Update display
		for (let i = 0; i < activeSVG.buttons.length; ++i) {
			const label = activeSVG.buttons[i].label;
			const border = activeSVG.buttons[i].border;
			if (i == hoverIconID) {
				label.style("opacity", "1.0");
				border.style("opacity", "1.0");
			} else {
				label.style("opacity", "0.7");
				border.style("opacity", "0.7");
			}

		}
	}
}

/*
	Button action!
*/
var clickIconTrigger = function(d,i) {
	const id = d3.select(this).attr("value");
	if (id == 0) {
		setModalActive(id, true);
	} else if (id == 1) {
		setAllowD3Sticky(!allowD3Sticky);
		// Change label
		d3.select("#svgButtonLabel" + id).text("Pose Graph: " + ((allowD3Sticky) ? "ON" : "OFF"));
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

var createButton = (svg, sideRect, id, label) => {
	// Settings
	const scaleAll = 0.9;
	const padding = 15;
	const buttonWi = 180 * scaleAll;
	const buttonHei = 31 * scaleAll;
	const paddingVertical = 1;

	let newButton = {};

	// Border
	newButton.border = svg.append("rect")
		.attr("x", sideRect.x0)
		.attr("y", sideRect.y0 + (buttonHei + paddingVertical) * id - buttonHei * 0.65)
		.attr("width", buttonWi)
		.attr("height", buttonHei * 0.9)
		.style("stroke", "#fff")
		.style("stroke-width", "2")
		.attr("rx", "5")
		.attr("ry", "5")
		.attr("opacity", 0.7);

	// Capture mouse events
	newButton.trigger = svg.append("rect")
		.attr("id", "svgButtonTrigger" + id.toString())
		.attr("x", sideRect.x0)
		.attr("y", sideRect.y0 + (buttonHei + paddingVertical) * id - buttonHei * 0.65)
		.attr("width", buttonWi)
		.attr("height", buttonHei * 0.9)
		.attr("fill", "#fff")
		.attr("value", id)
		.attr("opacity", 0.0) // set to 0.5 whenever change labels
			.on("click", clickIconTrigger)
			.on("mouseover", mouseOverIconTrigger)
			.on("mouseout", mouseOutIconTrigger);

	// Text object
	newButton.label = svg.append("text")
		.attr("id", "svgButtonLabel" + id.toString())
		.attr("x", sideRect.x0 + 4)
		.attr("y", sideRect.y0 + (buttonHei + paddingVertical) * id)
		.attr("text-anchor", "start")
		.style("font-size", "20px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.7)
		.text(label)

	return newButton;
}

var drawInstructionsLine = (svg, text, x, y, lineNum) => {
	svg.append("text")
		.attr("x", x)
		.attr("y", y + 19 * lineNum)
		.attr("text-anchor", "start")
		.style("font-size", "15px")
		.style("font-weight", "normal")
		.style("fill", "#fff")
		.style("pointer-events", "none")
		.style("opacity", 0.7)
		.text(text);
}

// Add panel showing selected mode
// TODO: Move styles to CSS
var createD3SideIcons = (svg, width, height) => {
	// Settings
	const scaleAll = 0.9;
	const padding = 15;

	const sideRect = {
		wi: 100 * scaleAll,
		hei: 400 * scaleAll,
	};
	sideRect.x0 = padding;
	sideRect.y0 = padding * 1.5;
	sideRect.x1 = sideRect.x0 + sideRect.wi;
	sideRect.y1 = sideRect.y0 + sideRect.hei;

	// Reset buttons
	activeSVG.buttons = [
		createButton(svg, sideRect, 0, "Select Piano Notes"),
		createButton(svg, sideRect, 1, "Pose Graph: ON"),
	];

	// Instructions text
	const instructionsStartX = sideRect.x0 + 4;
	const instructionsStartY = sideRect.y0 + (65 * scaleAll);
	drawInstructionsLine(svg, "Click nodes for more info", instructionsStartX, instructionsStartY, 0);
	drawInstructionsLine(svg, "Drag nodes to pose graph", instructionsStartX, instructionsStartY + 5, 1);
	drawInstructionsLine(svg, "Press 'Select Piano Notes'", instructionsStartX, instructionsStartY + 10, 2);
	drawInstructionsLine(svg, "to choose algorithm inputs.", instructionsStartX, instructionsStartY + 10, 3);

}

