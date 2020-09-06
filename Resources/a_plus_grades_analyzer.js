let wSvg,
	hSvg,
	depFileReader,
	courseFileReader,
	studentFileReader,
	gradeFileReader,
	depFileArr = [],
	courseFileArr = [],
	studentFileArr = [],
	gradeFileArr = [],
	depFileColErr = false,
	courseFileColErr = false,
	studentFileColErr = false,
	gradeFileColErr = false;

const topDiv = d3.select("#top_div"),
		tooltip = d3.select("#tooltip"),
		svgChartContainer = d3.select("#svg_chart_container"),
		viewSelect = d3.select("#view_select"),
		subViewSelect = d3.select("#sub_view_select"),
		colSubViewSelect = d3.select("#col_sub_view_select"),
		studDepOption = d3.select("#stud_dep_option"),
		colCourseOption = d3.select("#col_course_option"),
		colCourseDepOption = d3.select("#col_course_dep_option"),
		columnOptionsTd = d3.select("#column_options_td"),
		cgByBatchOption = d3.select("#cg_by_batch"),
		svgChart = d3.select("#svg_chart"),	
		filtersDiv = d3.select("#filters_div"),
		lowerBatchYear = d3.select("#lower_batch_year"),
		upperBatchYear = d3.select("#upper_batch_year"),
		studentsGenderSel = d3.select("#students_gender_sel"),
		studentsDepSel = d3.select("#students_dep_sel"),
		studentsDepNotCheck = d3.select("#students_dep_not_check"),
		studentsDepNotCheckTd = d3.select("#students_dep_not_check_td"),
		studentsCitySel = d3.select("#students_city_sel"),
		studentsCityNotCheck = d3.select("#students_city_not_check"),
		studentsCityNotCheckTd = d3.select("#students_city_not_check_td"),
		studentsJeeSel = d3.select("#students_jee_sel"),
		studentsJeeNotCheck = d3.select("#students_jee_not_check"),
		studentsJeeNotCheckTd = d3.select("#students_jee_not_check_td"),
		studentsProgSel = d3.select("#students_prog_sel"),
		studentsProgNotCheck = d3.select("#students_prog_not_check"),
		studentsProgNotCheckTd = d3.select("#students_prog_not_check_td"),
		studentsCatSel = d3.select("#students_cat_sel"),
		studentsCatNotCheck = d3.select("#students_cat_not_check"),
		studentsCatNotCheckTd = d3.select("#students_cat_not_check_td"),
		lowerCourseYear = d3.select("#lower_course_year"),
		upperCourseYear = d3.select("#upper_course_year"),
		courseSemesterSel = d3.select("#courses_semester_sel"),
		coursesDepSel = d3.select("#courses_dep_sel"),
		coursesDepNotCheck = d3.select("#courses_dep_not_check"),
		coursesDepNotCheckTd = d3.select("#courses_dep_not_check_td"),
		coursesCourseSel = d3.select("#courses_course_sel"),
		coursesCourseNotCheck = d3.select("#courses_course_not_check"),
		coursesCourseNotCheckTd = d3.select("#courses_course_not_check_td"),
		topGradesDiv = d3.select("#top_grades_div"),					
		topGradesSel = d3.select("#top_grades_sel"),
		lowGradesSel = d3.select("#low_grades_sel"),
		topCgsDiv = d3.select("#top_cgs_div"),
		topCgSel = d3.select("#top_cg_sel"),
		detailsDiv = d3.select("#details_div"),
		topTable = d3.select("#top_table"),
		radioTable = d3.select("#radio_table"),
		fileUploadDiv = d3.select("#file_upload_div"),
		detailsTableOptions = d3.select("#details_table_options"),
		detailsHeadingTd = d3.select("#details_heading_td"),
		numSpan = d3.select("#num_span"),
		pageSizeSel = d3.select("#page_size_sel"),
		prevButton = d3.select("#prev_button"),
		nextButton = d3.select("#next_button"),
		detailsHeaderDiv = d3.select("#details_header_div"),
		detailsHeaderRow = d3.select("#details_header_row"),
		detailsTableDiv = d3.select("#details_table_div"),
		detailsHeaderTable = d3.select("#details_header_table"),
		detailsTableContainer = d3.select("#details_table_container"),
		detailsTable = d3.select("#details_table"),
		detailsTableBody = d3.select("#details_table_body"),
		footer = d3.select("#footer"),
		depFileInput = d3.select("#dep_file"),
		courseFileInput = d3.select("#course_file"),
		studentFileInput = d3.select("#student_file"),
		gradeFileInput = d3.select("#grade_file"),
		selectedDepFile = d3.select("#selected_dep_file"),
		selectedCourseFile = d3.select("#selected_course_file"),
		selectedStudentFile = d3.select("#selected_student_file"),
		selectedGradeFile = d3.select("#selected_grade_file"),
		loadFileButton = d3.select("#load_file_button"),
		loadSampleButton = d3.select("#load_sample_button"),
		exportButton = d3.select("#export_button"),
		lowCgSel = d3.select("#low_cg_sel");
		
wSvg = 500
hSvg = 100;

loadFileButton.on('click', loadSelectedFiles);
loadSampleButton.on('click', loadSampleData);
pageSizeSel.on('change', pageSizeChanged);
lowCgSel.on('change', updateChart);
topCgSel.on('change', updateChart);
topGradesSel.on('change', updateChart);
lowGradesSel.on('change', updateChart);
coursesCourseSel.on('change', courseChanged);
coursesDepSel.on('change', coursesDepChanged);
courseSemesterSel.on('change', semesterChanged);
studentsCatSel.on('change', catChanged);
studentsProgSel.on('change', progChanged);
studentsJeeSel.on('change', langChanged);
studentsCitySel.on('change', cityChanged);
studentsDepSel.on('change', studentsDepChanged);
studentsGenderSel.on('change', genderChanged);
colSubViewSelect.on('change', colSubViewChanged);
subViewSelect.on('change', subViewChanged);
viewSelect.on('change', mainViewChanged);
prevButton.on('click', prevClicked);
nextButton.on('click', nextClicked);
exportButton.on('click', exportData);
studentsDepNotCheck.on('click', updateData);
studentsCityNotCheck.on('click', updateData);
studentsJeeNotCheck.on('click', updateData);
studentsProgNotCheck.on('click', updateData);
studentsCatNotCheck.on('click', updateData);
coursesDepNotCheck.on('click', updateData);
coursesCourseNotCheck.on('click', updateData);


depFileInput.on('change', function(){
	let me = this;
	depFileColErr = false;
	selectedDepFile.html(me.files[0].name);
	depFileReader = new FileReader();
	depFileReader.onload = function(e){
		readCsvFile(depFileReader.result, depFileArr);
		// check column header
		let headers = depFileArr[0];
		headers = headers.map(function(h){
			return h.trim().toLowerCase();
		});
		if(headers.indexOf("code") < 0){
			depFileColErr = true;
		}
		if(headers.indexOf("name") < 0){
			depFileColErr = true;
		}
		if(depFileColErr){
			selectedDepFile.html(me.files[0].name + " - <span style='color:red;'>Required columns missing!</span>")
		}
		checkLoadedFiles();
	};
	depFileReader.readAsText(me.files[0]);
});
courseFileInput.on('change', function(){
	let me = this;
	courseFileColErr = false;
	selectedCourseFile.html(me.files[0].name);
	courseFileReader = new FileReader();
	courseFileReader.onload = function(e){
		readCsvFile(courseFileReader.result, courseFileArr);
		// check column header
		let headers = courseFileArr[0];
		headers = headers.map(function(h){
			return h.trim().toLowerCase();
		});
		if(headers.indexOf("department code") < 0){
			courseFileColErr = true;
		}
		if(headers.indexOf("course code") < 0){
			courseFileColErr = true;
		}
		if(headers.indexOf("name") < 0){
			courseFileColErr = true;
		}
		if(headers.indexOf("credits") < 0){
			courseFileColErr = true;
		}
		if(courseFileColErr){
			selectedCourseFile.html(me.files[0].name + " - <span style='color:red;'>Required columns missing!</span>")
		}
		checkLoadedFiles();
	};
	courseFileReader.readAsText(me.files[0]);
});
studentFileInput.on('change', function(){
	let me = this;
	studentFileColErr = false;
	selectedStudentFile.html(me.files[0].name);
	studentFileReader = new FileReader();
	studentFileReader.onload = function(e){
		readCsvFile(studentFileReader.result, studentFileArr);
		// check column header
		let headers = studentFileArr[0];
		headers = headers.map(function(h){
			return h.trim().toLowerCase();
		});
		if(headers.indexOf("roll number") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("name") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("gender") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("department code") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("city") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("jee language") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("category") < 0){
			studentFileColErr = true;
		}
		if(headers.indexOf("program") < 0){
			studentFileColErr = true;
		}
		if(studentFileColErr){
			selectedStudentFile.html(me.files[0].name + " - <span style='color:red;'>Required columns missing!</span>")
		}
		checkLoadedFiles();
	};
	studentFileReader.readAsText(me.files[0]);
});
gradeFileInput.on('change', function(){
	let me = this;
	gradeFileColErr = false;
	selectedGradeFile.html(me.files[0].name);
	gradeFileReader = new FileReader();
	gradeFileReader.onload = function(e){
		 readCsvFile(gradeFileReader.result, gradeFileArr);
		// check column header
		let headers = gradeFileArr[0];
		headers = headers.map(function(h){
			return h.trim().toLowerCase();
		});
		if(headers.indexOf("roll number") < 0){
			gradeFileColErr = true;
		}
		if(headers.indexOf("course code") < 0){
			gradeFileColErr = true;
		}
		if(headers.indexOf("year") < 0){
			gradeFileColErr = true;
		}
		if(headers.indexOf("semester") < 0){
			gradeFileColErr = true;
		}
		if(headers.indexOf("grade") < 0){
			gradeFileColErr = true;
		}
		if(gradeFileColErr){
			selectedGradeFile.html(me.files[0].name + " - <span style='color:red;'>Required columns missing!</span>")
		}
		checkLoadedFiles();
	};
	gradeFileReader.readAsText(me.files[0]);
});

function readCsvFile(csvText, csvArr){
	let allTextLines = csvText.split(/\r\n|\n/);
	// get rid of empthy ending rows
	while(allTextLines[allTextLines.length - 1].length === 0){
		allTextLines.pop();
	}
	for (let i=0; i<allTextLines.length; i++) {
		let data = allTextLines[i].split(',');
		let tarr = [];
		for (let j=0; j<data.length; j++) {
			tarr.push(data[j]);
		}
		if(data.length === 1 && tarr[0] === ""){
			// dont push it in
		}else{
			csvArr[i] = tarr;
		}
	}
}

function checkLoadedFiles(){
	if(depFileArr && courseFileArr && studentFileArr && gradeFileArr){
		if(!depFileColErr && !courseFileColErr && !studentFileColErr && !gradeFileColErr){
			loadFileButton.property("disabled", false);
		}else{
			loadFileButton.property("disabled", true);
		}
	}else{
		loadFileButton.property("disabled", true); 
	}
}

function loadSelectedFiles(){
	prepareVisualization();
}

function loadSampleData(){
	let head = d3.select("head");
	head.append("script")
		.attr("src", "Resources/departments.js");
	
	head.append("script")
		.attr("src", "Resources/courses.js");
		
	head.append("script")
		.attr("src", "Resources/students.js");
	
	head.append("script")
		.attr("src", "Resources/grades.js");
	
	let checkLoad = function(){
		if(typeof departmentsData !== "undefined" && typeof coursesData !== "undefined" && typeof studentsData !== "undefined" && typeof gradesData !== "undefined"){
			depFileArr = departmentsData;
			courseFileArr = coursesData;
			studentFileArr = studentsData;
			gradeFileArr = gradesData;
			prepareVisualization();
		}else{
			console.log("not loaded");
			checkTimer = setTimeout(checkLoad, 50);
		}
	}
	let checkTimer = setTimeout(checkLoad, 5);				
}

function prepareVisualization(){
	fileUploadDiv.style("display", "none");
	detailsDiv.style("display", null);
	topTable.style("display", null);
	radioTable.style("display", null);
	showInfoMessage("Parsing data ...");
	setTimeout(function(){
		understandData();
		updateFilters();
		prepareGoodData();
		resize();
	}, 2);
}
//appendText(xCord, yCord, textAnchor, fontSize, fontWeight, txt, fontClass, fontColor, fontDisplay, fontData
function appendText(elem, configObj){
	let tt = elem.append("text");
	
	if(configObj.xCord){
		tt.attr("x", configObj.xCord);
	}
	if(configObj.yCord){
		tt.attr("y", configObj.yCord);
	}
	if(configObj.textAnchor){
		tt.attr("text-anchor",configObj.textAnchor);
	}
	if(configObj.txt){
		tt.text(configObj.txt);
	}		
	if(configObj.fontSize){
		tt.style("font-size", configObj.fontSize);
	}
	if(configObj.fontColor){
		tt.style("fill", configObj.fontColor);
	}				
	if(configObj.fontWeight){
		tt.style("font-weight", configObj.fontWeight);
	}
	if(configObj.fontClass){
		tt.attr("class", configObj.fontClass);
	}
	if(configObj.fontDisplay){
		tt.style("display", configObj.fontDisplay);
	}
	if(configObj.fontData){
		tt.datum(configObj.fontData);
	}
	return tt;
}
			
function showInfoMessage(msg){
	svgChart.selectAll("*").remove();
	appendText(svgChart, {"xCord":wSvg/2, "yCord":20, "textAnchor":"middle", "txt":msg, "fontColor":"red"});
}
const GRADE_VALUES = {"A+":11,
						"A":10,
						"A-":9,
						"B":8,
						"B-":7,
						"C":6,
						"C-":5,
						"D":4,
						"E":3,
						"F":0},
		ALL_GRADES = ["F", "E", "D", "C-", "C", "B-", "B", "A-", "A", "A+"],
		ALL_CGS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
		colors10 = d3.schemeCategory10;
		
let allBatches = [],
	allLanguages = [],
	allCategories = [],
	allPrograms = [],
	allCities = [],
	allStudentsArr = [],
	allStudentsObj = {},
	allCoursesArr = [],
	allCoursesObj = {},
	allDepsArr = [],
	allDepsObj = {},
	courseYears = [],
	resizeTimer,
	updateTimer,
	pageSize = 50,
	scrollTimer,
	displayRowIndex,
	detailsSortedBy = "Students ID",
	detailsSortingOrder = "ASC",
	tempDetailsSortedBy = {},
	tempDetailsSortingOrder = {},
	batchLowerYearValue,
	batchUpperYearValue,
	studentGenderValue,
	studentsLanguages = [],
	courseLowerYearValue,
	courseUpperYearValue,
	goodStudents,
	goodCourses,
	goodGrades,
	displayRows,
	displayRowsType,
	goodGradesArr,
	goodCGArr,
	goodCGObj,
	goodCGSummary,
	detailsTableHeight,
	detailsTableWidth,
	studentArrIdCol = 0,
	studentArrNameCol = 1,
	studentArrGenderCol = 2,
	studentArrDepCol = 3,
	studentArrCityCol = 4,
	studentArrLangCol = 5,
	studentArrCatCol = 6,
	studentArrProgCol = 7,
	coursesArrDepCol = 0,
	coursesArrIdCol = 1,
	coursesArrNameCol = 2,
	coursesArrCreditCol = 3,
	depsArrIdCol = 0,
	depsArrNameCol = 1,
	gradesArrStudCol = 0,
	gradesArrCourseCol = 1,
	gradesArrYearCol = 2,
	gradesArrSemCol = 3,
	gradesArrGradeCol = 4,
	formatNumber = d3.format(",d"),
	formatDecimal = d3.format(".1f"),
	formatDecimal3 = d3.format(".3f"),
	formatDollar = d3.format("$,"),
	formatDollarSI = d3.format("$.2s"),
	formatPercent = d3.format(".1%"),
	formatTime = d3.timeFormat("%m/%d/%Y"); //%m/%d/%Y   // %B %d, %Y	


lowerBatchYear.on("click", lowerBatchYearChanged)
			.on("keyup",lowerBatchYearChanged)
			.on("change",lowerBatchYearChanged);

upperBatchYear.on("click", upperBatchYearChanged)
			.on("keyup",upperBatchYearChanged)
			.on("change",upperBatchYearChanged);
			
lowerCourseYear.on("click", lowerCourseYearChanged)
				.on("keyup",lowerCourseYearChanged)
				.on("change",lowerCourseYearChanged);

upperCourseYear.on("click", upperCourseYearChanged)
				.on("keyup",upperCourseYearChanged)
				.on("change",upperCourseYearChanged);

window.onresize = function(){
	if(resizeTimer){
		clearTimeout(resizeTimer);
	}
	resizeTimer = setTimeout(resize, 50);
}

function resize(){
	if(depFileArr && courseFileArr && studentFileArr && gradeFileArr){
		wSvg = window.visualViewport.width - 325 - 50;
		hSvg = window.visualViewport.height - topDiv.node().scrollHeight - 15;
		if(wSvg < 200){
			wSvg = 200;
		}
		if(hSvg < 200){
			hSvg = 200;
		}
		detailsTableHeight = window.visualViewport.height - detailsTableOptions.node().scrollHeight - footer.node().scrollHeight - 20;
		detailsTableWidth = window.visualViewport.width - 40;
		if(detailsTableHeight < 200){
			detailsTableHeight = 200;
		}
		if(detailsTableWidth < 200){
			detailsTableWidth = 200;
		}
		
		detailsTableContainer.style("height", detailsTableHeight- 20)
								.style("width", detailsTableWidth)
								.style("max-height", detailsTableHeight - 20);
		
		detailsHeaderDiv.style("width", detailsTableWidth);			
		detailsTable.style("width", detailsTableWidth - 20);
		detailsHeaderTable.style("width", detailsTableWidth - 20);
		
		svgChart.attr("width", wSvg)
				.attr("height", hSvg);
		mainViewChanged();		
	}
}

function updateFilters(){
	lowerBatchYear.attr("value", d3.min(allBatches))
					.attr("min", d3.min(allBatches))
					.attr("max", d3.max(allBatches));
					
	upperBatchYear.attr("value", d3.max(allBatches))
					.attr("min", d3.min(allBatches))
					.attr("max", d3.max(allBatches));
	
	studentsDepSel.append("option")
					.attr("value", "all")
					.html("All");
	
	coursesDepSel.append("option")
					.attr("value", "all")
					.html("All");
					
	allDepsArr.forEach(function(dd){
		studentsDepSel.append("option")
						.attr("value", dd)
						.html(allDepsObj[dd]);
						
		coursesDepSel.append("option")
						.attr("value", dd)
						.html(allDepsObj[dd]);				
	});
	
	studentsCitySel.append("option")
					.attr("value", "all")
					.html("All");
					
	allCities.forEach(function(cc){
		studentsCitySel.append("option")
						.attr("value", cc)
						.html(cc);
	});
	
	studentsJeeSel.append("option")
					.attr("value", "all")
					.html("All");
					
	allLanguages.forEach(function(ll){
		studentsJeeSel.append("option")
						.attr("value", ll)
						.html(ll);
	});
	
	studentsProgSel.append("option")
					.attr("value", "all")
					.html("All");
					
	allPrograms.forEach(function(pp){
		studentsProgSel.append("option")
						.attr("value", pp)
						.html(pp);
	});
	
	studentsCatSel.append("option")
					.attr("value", "all")
					.html("All");
	
	allCategories.forEach(function(cc){
		studentsCatSel.append("option")
						.attr("value", cc)
						.html(cc);
	});
	
	lowerCourseYear.attr("value", d3.min(courseYears))
					.attr("min", d3.min(courseYears))
					.attr("max", d3.max(courseYears));

	upperCourseYear.attr("value", d3.max(courseYears))
					.attr("min", d3.min(courseYears))
					.attr("max", d3.max(courseYears));
	
	coursesCourseSel.append("option")
					.attr("value", "all")
					.html("All");
	
	allCoursesArr.forEach(function(cc){
		coursesCourseSel.append("option")
						.attr("value", cc)
						.html(cc + " - " + allCoursesObj[cc]['name']);
	});
	
	ALL_GRADES.forEach(function(g){
		topGradesSel.append("option")
					.attr("value", g)
					.html(g)
					.property("selected", g === "A-" ? true : false);
					
		lowGradesSel.append("option")
					.attr("value", g)
					.html(g)
					.property("selected", g === "D" ? true : false);			
	});
	
	ALL_CGS.forEach(function(c){
		topCgSel.append("option")
					.attr("value", c)
					.html(c)
					.property("selected", c === "8" ? true : false);
					
		lowCgSel.append("option")
					.attr("value", c)
					.html(c)
					.property("selected", c === "5" ? true : false);			
	});
}

function lowerBatchYearChanged(){
	timedUpdate();
}

function timedUpdate(){
	if(updateTimer){
		clearTimeout(updateTimer);
	}
	updateTimer = setTimeout(updateData, 50);
	
}

function upperBatchYearChanged(){
	timedUpdate();
}

function genderChanged(){
	updateData();
}

function studentsDepChanged(){
	if(studentsDepSel.node().value === "all"){
		studentsDepNotCheckTd.style("display", "none");
	}else{
		studentsDepNotCheckTd.style("display", null);
	}
	updateData();
}

function cityChanged(){
	if(studentsCitySel.node().value === "all"){
		studentsCityNotCheckTd.style("display", "none");
	}else{
		studentsCityNotCheckTd.style("display", null);
	}
	updateData();
}

function langChanged(){
	if(studentsJeeSel.node().value === "all"){
		studentsJeeNotCheckTd.style("display", "none");
	}else{
		studentsJeeNotCheckTd.style("display", null);
	}
	updateData();
}

function progChanged(){
	if(studentsProgSel.node().value === "all"){
		studentsProgNotCheckTd.style("display", "none");
	}else{
		studentsProgNotCheckTd.style("display", null);
	}
	updateData();
}

function catChanged(){
	if(studentsCatSel.node().value === "all"){
		studentsCatNotCheckTd.style("display", "none");
	}else{
		studentsCatNotCheckTd.style("display", null);
	}
	updateData();
}

function semesterChanged(){
	updateData();
}

function coursesDepChanged(){
	if(coursesDepSel.node().value === "all"){
		coursesDepNotCheckTd.style("display", "none");
	}else{
		coursesDepNotCheckTd.style("display", null);
	}
	updateData();
}

function courseChanged(){
	if(coursesCourseSel.node().value === "all"){
		coursesCourseNotCheckTd.style("display", "none");
	}else{
		coursesCourseNotCheckTd.style("display", null);
	}
	updateData();
}

function lowerCourseYearChanged(){
	timedUpdate();
}

function upperCourseYearChanged(){
	timedUpdate();
}

function understandData(){
	studentFileArr.forEach(function(sd, si){
		if(si === 0) return;
		allStudentsArr.push(sd[studentArrIdCol]);
		let newObj = {};
		newObj['name'] = sd[studentArrNameCol];
		newObj['gender'] = sd[studentArrGenderCol];
		newObj['dep'] = sd[studentArrDepCol];
		
		let year = +("20" + sd[studentArrIdCol].substring(0, 2));
		if(allBatches.indexOf(year) < 0){
			allBatches.push(year);
		}
		newObj['batchYear'] = year;
		if(allCities.indexOf(sd[studentArrCityCol]) < 0){
			allCities.push(sd[studentArrCityCol]);
		}
		newObj['city'] = sd[studentArrCityCol];
		if(allLanguages.indexOf(sd[studentArrLangCol]) < 0){
			allLanguages.push(sd[studentArrLangCol]);
		}
		newObj['lang'] = sd[studentArrLangCol];
		if(allCategories.indexOf(sd[studentArrCatCol]) < 0){
			allCategories.push(sd[studentArrCatCol]);
		}
		newObj['cat'] = sd[studentArrCatCol];
		if(allPrograms.indexOf(sd[studentArrProgCol]) < 0){
			allPrograms.push(sd[studentArrProgCol]);
		}
		newObj['prog'] = sd[studentArrProgCol];
		allStudentsObj[sd[studentArrIdCol]] = newObj;
	});
	courseFileArr.forEach(function(cd, ci){
		if(ci === 0) return;
		allCoursesArr.push(cd[coursesArrIdCol]);
		let newObj = {};
		newObj['name'] = cd[coursesArrNameCol];
		newObj['dep'] = cd[coursesArrDepCol];
		newObj['credit'] = +cd[coursesArrCreditCol];
		allCoursesObj[cd[coursesArrIdCol]] = newObj;
	});
	
	depFileArr.forEach(function(dd, di){
		if(di === 0) return;
		allDepsArr.push(dd[depsArrIdCol]);
		allDepsObj[dd[depsArrIdCol]] = dd[depsArrNameCol];
	});
	
	gradeFileArr.forEach(function(gd, gi){
		if(gi === 0) return;
		if(courseYears.indexOf(+gd[gradesArrYearCol]) < 0){
			courseYears.push(+gd[gradesArrYearCol]);
		}
	});
	allDepsArr.sort();
	allCities.sort();
	allLanguages.sort();
	allPrograms.sort();
	allCoursesArr.sort();
	allCategories.sort();
}

function headerScrolled(){
	if(scrollTimer){
		clearTimeout(scrollTimer);
	}
	scrollTimer = setTimeout(function(){
		otherColsDiv.node().scrollLeft = detailsHeaderDiv.node().scrollLeft;
	}, 10);
}

function firstColScrolled(){
	if(scrollTimer){
		clearTimeout(scrollTimer);
	}
	scrollTimer = setTimeout(function(){
		otherColsDiv.node().scrollTop = firstTwoColsDiv.node().scrollTop;
	}, 10);			
}

function detailScrolled(){
	if(scrollTimer){
		clearTimeout(scrollTimer);
	}
	scrollTimer = setTimeout(function(){
		detailsHeaderDiv.node().scrollLeft = otherColsDiv.node().scrollLeft;
		firstTwoColsDiv.node().scrollTop = otherColsDiv.node().scrollTop;
	}, 10);			
}

// takes two txt values a and b, returns -1, if a should be before b, +1 if a should be after b, 0 other wise
function compareText(a,b){
	
	let txtA = a.toUpperCase();
	let txtB = b.toUpperCase();
	if(txtA < txtB){
		return -1;
	}
	if(txtA > txtB){
		return 1;
	}
	return 0;
}

function sortDetailsData(d){
	if(d){
		if(d === "Course Details") return;
		if(d === detailsSortedBy){
			// flip order
			if(detailsSortingOrder === "ASC"){
				detailsSortingOrder = "DEC";
			}else{
				detailsSortingOrder = "ASC";
			}
		}else{
			detailsSortingOrder = "ASC";
		}
		detailsSortedBy = d;
	}else{
		detailsSortedBy = "Students ID";
		detailsSortingOrder = "ASC";
	}
	
	// remove any up/down arrows
	// add up/down array
	d3.selectAll(".header_td").each(function(s){
		let txt = s;
		if(s === detailsSortedBy){
			if(detailsSortingOrder === "ASC"){
				txt = txt + " &#8679;";
			}else{
				txt = txt + " &#8681;";
			}
		}
		d3.select(this).html(txt);
	});
	if(displayRowsType === 'grades'){
		switch(detailsSortedBy){
			case "Students ID":
				displayRows.sort(function(a, b){
					let ret = compareText(a[gradesArrStudCol], b[gradesArrStudCol]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Student Name":
				displayRows.sort(function(a, b){
					let ret = compareText(allStudentsObj[a[gradesArrStudCol]]['name'], allStudentsObj[b[gradesArrStudCol]]['name']);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Course ID":
				displayRows.sort(function(a, b){
					let ret = compareText(a[gradesArrCourseCol], b[gradesArrCourseCol]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Course Name":
				displayRows.sort(function(a, b){
					let ret = compareText(allCoursesObj[a[gradesArrCourseCol]]['name'], allCoursesObj[b[gradesArrCourseCol]]['name']);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Year":
				displayRows.sort(function(a, b){
					let ret = compareText(a[gradesArrYearCol], b[gradesArrYearCol]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Semester":
				displayRows.sort(function(a, b){
					let ret = compareText(a[gradesArrSemCol], b[gradesArrSemCol]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Grade":
				displayRows.sort(function(a, b){
					let ret = compareText(a[gradesArrGradeCol], b[gradesArrGradeCol]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;									
		}				
	}
	if(displayRowsType === 'cg'){
		switch(detailsSortedBy){
			case "Students ID":
				displayRows.sort(function(a, b){
					let ret = compareText(a,b);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Student Name":
				displayRows.sort(function(a, b){
					let ret = compareText(allStudentsObj[a]['name'], allStudentsObj[b]['name']);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "CG":
				displayRows.sort(function(a, b){
					let ret = (goodCGObj[a][0]/goodCGObj[a][1]) - (goodCGObj[b][0]/goodCGObj[b][1]);
					if(detailsSortingOrder === "DEC"){
						ret = - ret;
					}
					return ret;
				});
				break;
			case "Course Details":
				break;								
		}				
	}
	displayRowIndex = 0;
	showDisplayData();
}

function sortTempDetailsData(d){
	if(tempDetailsSortedBy[d[0]]){
		if(d[1] != ""){
			if(tempDetailsSortedBy[d[0]] === d[1]){
				// flip order
				if(tempDetailsSortingOrder[d[0]] === "ASC"){
					tempDetailsSortingOrder[d[0]] = "DEC";
				}else{
					tempDetailsSortingOrder[d[0]] = "ASC";
				}
			}else{
				tempDetailsSortingOrder[d[0]] = "ASC";
			}
			tempDetailsSortedBy[d[0]] = d[1];
		}
	}else{
		// d[1] will be present if we are here
		tempDetailsSortedBy[d[0]] = d[1];
		tempDetailsSortingOrder[d[0]] = "ASC";
	}
	
	// remove any up/down arrows
	// add up/down array
	d3.selectAll("._" + d[0] + "_header_td").each(function(s){
		let txt = s[1];
		if(s[1] === tempDetailsSortedBy[d[0]]){
			if(tempDetailsSortingOrder[d[0]] === "ASC"){
				txt = txt + " &#8679;";
			}else{
				txt = txt + " &#8681;";
			}
		}
		d3.select(this).html(txt);
	});
	switch(tempDetailsSortedBy[d[0]]){
		case "Course ID":
			goodCGObj[d[0]][2].sort(function(a, b){
				let ret = compareText(a[0],b[0]);
				if(tempDetailsSortingOrder[d[0]] === "DEC"){
					ret = - ret;
				}
				return ret;
			});
			break;
		case "Year":
			goodCGObj[d[0]][2].sort(function(a, b){
				let ret = compareText(a[1],b[1]);
				if(tempDetailsSortingOrder[d[0]] === "DEC"){
					ret = - ret;
				}
				return ret;
			});
			break;
		case "Semester":
			goodCGObj[d[0]][2].sort(function(a, b){
				let ret = compareText(a[2],b[2]);
				if(tempDetailsSortingOrder[d[0]] === "DEC"){
					ret = - ret;
				}
				return ret;
			});
			break;
		case "Credit":
			goodCGObj[d[0]][2].sort(function(a, b){
				let ret = a[3] - b[3];
				if(tempDetailsSortingOrder[d[0]] === "DEC"){
					ret = - ret;
				}
				return ret;
			});
			break;
		case "Grade":
			goodCGObj[d[0]][2].sort(function(a, b){
				let ret = compareText(a[4],b[4]);
				if(tempDetailsSortingOrder[d[0]] === "DEC"){
					ret = - ret;
				}
				return ret;
			});
			break;
	}
	goodCGObj[d[0]][2].forEach(function(r){
		d3.select("#_" + d[0] + "_" + r[0]  + "_" + r[1]  + "_" + r[2]).raise();
	});
}

function prevClicked(){
	displayRowIndex = displayRowIndex - pageSize;
	if (displayRowIndex === 0){
		prevButton.property("disabled", true);
	}else{
		prevButton.property("disabled", false);
	}
	nextButton.property("disabled", false);
	showDisplayData();
}

function nextClicked(){
	displayRowIndex = displayRowIndex + pageSize;
	if (displayRowIndex >= displayRows.length - pageSize){
		nextButton.property("disabled", true);
	}else{
		nextButton.property("disabled", false);
	}
	prevButton.property("disabled", false);
	showDisplayData();
}

function pageSizeChanged(){
	pageSize = +pageSizeSel.node().value;
	displayRowIndex = 0;
	if(displayRows.length < pageSize){
		prevButton.style("display", "none");
		nextButton.style("display", "none");
	}else{
		prevButton.style("display", null);
		nextButton.style("display", null);
		prevButton.property("disabled", true);
	}
	showDisplayData();
}

function getYear(d){
	let yy;
	if(d === ""){
		yy =  "";
	}else{
		yy = +d.split("/")[2];
	}
	return yy;
}

function getDate(d){
	let dt;
	if(d === ""){
		dt = new Date();
		dt.setYear(0);
	}else{
		dtArr = d.split("/");
		dt = new Date(+dtArr[2],+dtArr[0] - 1, +dtArr[1]);
	}
	return dt;
}			

function mainViewChanged(){
	if(viewSelect.node().value === "one_view"){
		// show cg by chart
		cgByBatchOption.style("display", null);
		// hide column options
		columnOptionsTd.style("display", "none");
	}else{
		// hide cg by chart
		if(cgByBatchOption.property("selected")){
			cgByBatchOption.property("selected", false);
		}
		cgByBatchOption.style("display", "none");
		columnOptionsTd.style("display", null);
	}
	subViewChanged();
}

function subViewChanged(){
	if(subViewSelect.node().value === "grades_view"){
		topGradesDiv.style("display", null);
		topCgsDiv.style("display", "none");
	}else{
		topGradesDiv.style("display", "none");
		topCgsDiv.style("display", null);
	}
	if(viewSelect.node().value === "one_column"){
		if(subViewSelect.node().value === "grades_view"){
			colCourseOption.style("display", null);
			colCourseDepOption.style("display", null);
		}else{
			// select students dep option
			studDepOption.property("selected", true);
			colCourseOption.style("display", "none");
			colCourseDepOption.style("display", "none");
		}
		colSubViewChanged();
	}else{
		updateChart();
	}
}

function colSubViewChanged(){
	updateChart();
}

function updateData(){
	svgChart.selectAll("*").remove();
	showInfoMessage("Updating view ...");			
	setTimeout(function(){
		prepareGoodData();
		createChart();
	}, 2);
}

function updateChart(){
	svgChart.selectAll("*").remove();
	showInfoMessage("Updating view ...");			
	setTimeout(function(){
		createChart();
	}, 2);
}

function createChart(){
	svgChart.selectAll("*").remove();
	if(goodGrades.length === 0) return;
	let topNum = 0,
		lowNum = 0,
		med,
		countObj = {},
		countObj2Level = {},
		numArr = [];
	if(viewSelect.node().value === "one_view"){
		if(subViewSelect.node().value === "grades_view"){
			goodGradesArr.forEach(function(ac){
				if(ALL_GRADES.indexOf(ac) >= ALL_GRADES.indexOf(topGradesSel.node().value)){
					topNum++
				}
				if(ALL_GRADES.indexOf(ac) <= ALL_GRADES.indexOf(lowGradesSel.node().value)){
					lowNum++
				}
				numArr.push(ALL_GRADES.indexOf(ac));
				if(countObj[ac]){
					countObj[ac]++;
				}else{
					countObj[ac] = 1;
				}
			});
			// sort in ascending order
			numArr.sort(function(a, b){
				if(a < b){
					return -1;
				}
				if(a > b){
					return 1;
				}
				return 0;
			});
			med = Math.floor(d3.median(numArr));
			percentile25 = Math.floor(d3.quantile(numArr, 0.25));
			percentile75 = Math.ceil(d3.quantile(numArr, 0.75));
			createBarStatsChart(svgChart, countObj, ALL_GRADES, 'string', (lowNum/goodGradesArr.length), med, percentile25, percentile75, (topNum/goodGradesArr.length));
		}
		if(subViewSelect.node().value === "cg_view"){
			goodCGArr.forEach(function(ac){
				if(ac >= +topCgSel.node().value){
					topNum++
				}
				if(ac < lowCgSel.node().value){
					lowNum++
				}
				if(countObj[Math.floor(ac)]){
					countObj[Math.floor(ac)]++;
				}else{
					countObj[Math.floor(ac)] = 1;
				}
			});
			// sort in ascending order
			goodCGArr.sort(function(a, b){
				if(a < b){
					return -1;
				}
				if(a > b){
					return 1;
				}
				return 0;
			});
			med = d3.median(goodCGArr);
			percentile25 = d3.quantile(goodCGArr, 0.25);
			percentile75 = d3.quantile(goodCGArr, 0.75);				
			createBarStatsChart(svgChart, countObj, ALL_CGS, 'number', (lowNum/goodCGArr.length), med, percentile25, percentile75, (topNum/goodCGArr.length));
		}
		if(subViewSelect.node().value === "cg_by_batch_view"){
			// initialize 2 level obj
			allBatches.forEach(function(bb){
				countObj2Level[bb] = {};
				ALL_CGS.forEach(function(cc){
					countObj2Level[bb][cc] = 0;
				});
			});
			d3.keys(goodCGObj).forEach(function(ss){
				if(goodCGObj[ss][1] > 0){
					countObj2Level[allStudentsObj[ss]['batchYear']][Math.floor(goodCGObj[ss][0]/ goodCGObj[ss][1])] ++;
				}
			});
			createBatchByCGBubbles(svgChart, countObj2Level);
		}
	}
	if(viewSelect.node().value === "one_column"){
		if(subViewSelect.node().value === "grades_view"){
			goodGradesArr.forEach(function(ac){
				if(ALL_GRADES.indexOf(ac) >= ALL_GRADES.indexOf(topGradesSel.node().value)){
					topNum++
				}
				if(ALL_GRADES.indexOf(ac) <= ALL_GRADES.indexOf(lowGradesSel.node().value)){
					lowNum++
				}
				numArr.push(ALL_GRADES.indexOf(ac));
				if(countObj[ac]){
					countObj[ac]++;
				}else{
					countObj[ac] = 1;
				}
			});
			// sort in ascending order
			numArr.sort(function(a, b){
				if(a < b){
					return -1;
				}
				if(a > b){
					return 1;
				}
				return 0;
			});
			med = d3.median(numArr);
			percentile25 = Math.floor(d3.quantile(numArr, 0.25));
			percentile75 = Math.ceil(d3.quantile(numArr, 0.75));
			createBarStatsChart(svgChart, countObj, ALL_GRADES, 'string', (lowNum/goodGradesArr.length), med, percentile25, percentile75, (topNum/goodGradesArr.length));
		}
		if(subViewSelect.node().value === "cg_view"){
			goodCGArr.forEach(function(ac){
				if(ac >= +topCgSel.node().value){
					topNum++
				}
				if(ac < lowCgSel.node().value){
					lowNum++
				}
				if(countObj[Math.floor(ac)]){
					countObj[Math.floor(ac)]++;
				}else{
					countObj[Math.floor(ac)] = 1;
				}
			});
			// sort in ascending order
			goodCGArr.sort(function(a, b){
				if(a < b){
					return -1;
				}
				if(a > b){
					return 1;
				}
				return 0;
			});
			med = d3.median(goodCGArr);
			percentile25 = d3.quantile(goodCGArr, 0.25);
			percentile75 = d3.quantile(goodCGArr, 0.75);				
			createBarStatsChart(svgChart, countObj, ALL_CGS, 'number', (lowNum/goodCGArr.length), med, percentile25, percentile75, (topNum/goodCGArr.length));
		}
		if(subViewSelect.node().value === "cg_by_batch_view"){
			// initialize 2 level obj
			allBatches.forEach(function(bb){
				countObj2Level[bb] = {};
				ALL_CGS.forEach(function(cc){
					countObj2Level[bb][cc] = 0;
				});
			});
			d3.keys(goodCGObj).forEach(function(ss){
				if(goodCGObj[ss][1] > 0){
					countObj2Level[allStudentsObj[ss]['batchYear']][Math.floor(goodCGObj[ss][0]/ goodCGObj[ss][1])] ++;
				}
			});
			createBatchByCGBubbles(svgChart, countObj2Level);
		}
	}
}

function createBatchByCGBubbles(svgElem, objToChart){
	let wChart = +svgElem.attr("width"),
		hChart = +svgElem.attr("height"),
		numRows = ALL_CGS.length,
		numCols = allBatches.length,
		blockWidth = (0.85 * wChart / numCols),
		blockHeight = (0.85 * hChart / numRows),
		boxSide,
		startX,
		startY,
		scaleR = d3.scaleSqrt();
		rMax = 0;
		
	if(blockWidth > blockHeight){
		boxSide = blockHeight;
		startX = (0.1 * wChart) + (((0.85 * wChart) - (numCols * boxSide))/2);
		startY = 0.9 * hChart;
	}else{
		boxSide = blockWidth;
		startX = 0.1 * wChart;
		startY = (0.9 * hChart) - (((0.85 * hChart) - (numRows * boxSide))/2);;
	}
	
	// get max for radius
	allBatches.forEach(function(bb){
		ALL_CGS.forEach(function(cc){
			if(objToChart[bb][cc] > rMax){
				rMax = objToChart[bb][cc];
			}
		});
	});
	scaleR.domain([0, rMax]).range([0, boxSide/1.8]);
	
	// draw the circles
	allBatches.forEach(function(bb, bi){
		// label for batches
		appendText(svgElem, {"xCord":(startX + ((bi + 0.5)*boxSide)), "yCord":(startY + 20), "textAnchor":"middle", "fontWeight":"bold", "txt":bb, "fontClass":"batch_label", "fontData":bb});
		ALL_CGS.forEach(function(cc, ci){
			// label for CGs (only first time)
			if(bi === 0){
				appendText(svgElem, {"xCord":(startX - 5), "yCord":(startY - ((ci + 0.5)*boxSide) + 5), "textAnchor":"end", "fontWeight":"bold", "txt":cc, "fontClass":"cg_label", "fontData":cc});
			}
			
			if(objToChart[bb][cc] > 0){
				let circleG = svgElem.append("g")
										.attr("transform", "translate(" + (startX + ((bi + 0.5) * boxSide)) + "," + (startY - ((ci + 0.5) * boxSide)) + ")")
										.datum([bb, cc])
										.attr("class", "cicle_g")
										.on("mouseenter", circleGMouseEnter)
										.on("mouseleave", circelGMouseLeave)
										.on("click", circleGClick);
				
				circleG.append("circle")
						.attr("r", scaleR(objToChart[bb][cc]))
						.style("fill", colors10[0])
						.style("opacity", 0.4);
				
				appendText(circleG, {"xCord":0, "yCord":5, "textAnchor":"middle", "fontSize":((boxSide/4) + "px"), "txt":formatNumber(objToChart[bb][cc]), "fontClass":"noselect"});
			}
			
		});
	});
	
	function circleGClick(d){
		displayRows = [];
		displayRowsType = 'cg';
		d3.keys(goodCGObj).forEach(function(cc){
			if(allStudentsObj[cc]['batchYear'] === d[0] && goodCGObj[cc][1] > 0 && Math.floor(goodCGObj[cc][0]/goodCGObj[cc][1]) === +d[1]){
				displayRows.push(cc);
			}
		});
		// add header
		addDetailsHeader();
		// focus on the details div
		detailsDiv.node().scrollIntoView();
		// show display data
		sortDetailsData();
	}
	
	function circleGMouseEnter(d){
		let dOut = d;
		svgElem.selectAll(".cg_label").style("opacity", function(d){
			if(dOut[1] === d){
				return 1;
			}else{
				return 0.1;
			}
		});
		svgElem.selectAll(".batch_label").style("opacity", function(d){
			if(dOut[0] === d){
				return 1;
			}else{
				return 0.1;
			}
		});
		svgElem.selectAll(".cicle_g").style("opacity", function(d){
			if(dOut[0] === d[0] && dOut[1] === d[1]){
				return 1;
			}else{
				return 0.1;
			}
		});
	}
	
	function circelGMouseLeave(){
		svgElem.selectAll(".cg_label").style("opacity", 1);
		svgElem.selectAll(".batch_label").style("opacity", 1);
		svgElem.selectAll(".cicle_g").style("opacity", 1);
	}
}

function createBarStatsChart(svgElem, objToChart, colsArr, type, lowPer, median, p25, p75, topPer){
	let wChart = +svgElem.attr("width"),
		hChart = +svgElem.attr("height"),
		margins = {
			left:wChart/10,
			right:wChart/20,
			bottom:wChart/20,
			top:wChart/10
		},
		blockWidth = wChart/10,
		xScale,
		yScale,
		yMax = 0,
		colGap = (wChart - margins.left - margins.right)/colsArr.length,
		colWidth = colGap * 0.95;
		
	if(margins.bottom < 35){
		margins.bottom = 35;
	}
	if(margins.left < 50){
		margins.left = 50;
	}
	
	xScale = d3.scaleLinear().range([margins.left, wChart - margins.right]);
	yScale = d3.scaleLinear().range([hChart - margins.bottom, margins.top]);
	const angleScale = d3.scaleLinear().range([0,2*Math.PI]);
	const arcGenerator = d3.arc()
							.innerRadius((blockWidth/3) - (colWidth/12))
							.outerRadius((blockWidth/3) + (colWidth/12));

	colsArr.forEach(function(ca){
		if(objToChart[ca] > yMax){
			yMax = objToChart[ca];
		}
	});
	
	yScale.domain([0, yMax]).nice();
	xScale.domain([0, colsArr.length]);
	
	colsArr.forEach(function(ca, ci){
		svgElem.append("rect")
				.attr("x", xScale(ci))
				.attr("y", objToChart[ca] ? yScale(objToChart[ca]) : yScale(0))
				.attr("width", colWidth)
				.attr("height", yScale(0) - (objToChart[ca] ? yScale(objToChart[ca]) : yScale(0)))
				.attr("class", "column_rect")
				.datum(ca)
				.style("fill", colors10[0])
				.on("mouseover", rectMouseOver)
				.on("mouseout", rectMouseOut)
				.on("click", rectMouseClick);
		if(type === "string"){
			appendText(svgElem, {"xCord":(xScale(ci) + (colWidth/2)), "yCord":(yScale(0) + 20), "textAnchor":"middle", "txt":ca, "fontClass":"column_name"});
		}
		appendText(svgElem, {"xCord":(xScale(ci) + (colWidth/2)), "yCord":((objToChart[ca] ? yScale(objToChart[ca]) : yScale(0)) - 2), "textAnchor":"middle", "txt":(objToChart[ca] ? formatNumber(objToChart[ca]) : "0"), "fontClass":"column_num", "fontDisplay":"none", "fontData":ca});
	});
	
	let yAxis = d3.axisLeft().scale(yScale);
				   
	
	
	if(type === "string"){
		//	append y axis with a gap
		svgElem.append("g")
				.style("font-size", "12px")
				.attr("transform","translate(" + (margins.left - (0.05 * colGap)) + ",0)")
				.call(yAxis);
	}else{
		//	append y axis without gap
		svgElem.append("g")
				.style("font-size", "12px")
				.attr("transform","translate(" + (margins.left) + ",0)")
				.call(yAxis);
				
		//	append x axis
		let xAxis = d3.axisBottom().scale(xScale);
					   
		svgElem.append("g")
				.style("font-size", "12px")
				.attr("transform","translate(0, " + (hSvg - margins.bottom) + ")")
				.call(xAxis);
	}
	
	//	append low percent clock
	let lowPercentG = svgElem.append("g")
								.attr("transform", "translate("+ (1.5 * blockWidth) + "," + (blockWidth/2) + ")")
								.attr("data_title", "Low " + (type === "string" ? "Grades" : "CG/SG") + " Percent")
								.attr("class", "top_g")
								.on("mouseenter",topGMouseEnter)
								.on("mouseleave",topGMouseLeave);
	
	appendClock(lowPercentG, colors10[0], angleScale(lowPer), formatPercent(lowPer), blockWidth/3, "clockwise");
	
	//	append median G
	let medianG = svgElem.append("g")
							.attr("transform", "translate("+ (3.5 * blockWidth) + ", 0)")
							.attr("data_title", "Median")
							.attr("class", "top_g")
							.on("mouseenter",topGMouseEnter)
							.on("mouseleave",topGMouseLeave);
	appendLine(medianG, 0, 0.8 * blockWidth, blockWidth, 0.8 * blockWidth, colors10[0], 1, "");
	
	appendEquilateralTriangle(medianG, (blockWidth/2), (0.8 * blockWidth), (0.1 * blockWidth), "up", colors10[0], "");
	
	appendText(medianG, {"xCord":(blockWidth/2), "yCord":(blockWidth * 0.7), "textAnchor":"middle", "fontSize":((blockWidth * 0.5) + "px"), "txt":(type === "string" ? colsArr[median] : formatDecimal(median)), "fontClass":"noselect"})
	//appendText(svgElem, {"xCord":p25XCoord, "yCord":(margins.top - 2), "textAnchor":"end", "fontSize":, "fontWeight":, "txt":, "fontClass":, "fontColor":, "fontDisplay":, "fontData":});
	//	append IQR G
	let iqrG = svgElem.append("g")
							.attr("transform", "translate("+ (6 * blockWidth) + ", 0)")
							.attr("data_title", "Inter-Quartile Range (IQR)")
							.attr("class", "top_g")
							.on("mouseenter",topGMouseEnter)
							.on("mouseleave",topGMouseLeave);
	
	
	appendLine(iqrG, 0.2 * blockWidth, 0.8 * blockWidth, 0.8 * blockWidth, 0.8 * blockWidth, colors10[0], 1, "");
	
	appendEquilateralTriangle(iqrG, (0.2 * blockWidth), (0.8 * blockWidth), (0.1 * blockWidth), "left", colors10[0], "");
	
	appendEquilateralTriangle(iqrG, (0.8 * blockWidth), (0.8 * blockWidth), (0.1 * blockWidth), "right", colors10[0], "");

	appendText(iqrG, {"xCord":(blockWidth/2), "yCord":(blockWidth * 0.7), "textAnchor":"middle", "fontSize":((blockWidth * 0.5) + "px"), "txt":formatDecimal(p75 - p25), "fontClass":"noselect"});
	
	//	append high percent clock
	let highPercentG = svgElem.append("g")
								.attr("transform", "translate("+ (9 * blockWidth) + "," + (blockWidth/2) + ")")
								.attr("data_title", "High " + (type === "string" ? "Grades" : "CG/SG") + " Percent")
								.attr("class", "top_g")
								.on("mouseenter",topGMouseEnter)
								.on("mouseleave",topGMouseLeave);
	
	appendClock(highPercentG, colors10[0], angleScale(1 - (topPer)), formatPercent(topPer), blockWidth/3, "anti-clockwise");
	
	function appendClock(clockElem, clockColor, clockAngle, clockText, clockRadius, clockDirection){
		clockElem.append("circle")
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("r",clockRadius)
						.style("fill","white")
						.style("stroke", clockColor)
						.style("stroke-width",1);
						
		if(clockDirection === "clockwise"){
			clockElem.append("path")
						.attr("d", arcGenerator.endAngle(clockAngle).startAngle(0))
						.style("fill", clockColor);
		}else{
			clockElem.append("path")
						.attr("d", arcGenerator.startAngle(clockAngle).endAngle(2*Math.PI))
						.style("fill", clockColor);
		}
		
		appendText(clockElem, {"xCord":0, "yCord":((clockRadius/4) - 2), "textAnchor":"middle", "fontSize":((clockRadius/2) + "px"), "txt":clockText, "fontClass":"noselect"})
	}
	
	function rectMouseClick(d){
		displayRows = [];
		if(subViewSelect.node().value === "grades_view"){
			displayRowsType = 'grades';
			goodGrades.forEach(function(gg){
				if(gg[gradesArrGradeCol] === d){
					displayRows.push(gg);
				}
			});
		}
		if(subViewSelect.node().value === "cg_view"){
			displayRowsType = 'cg';
			d3.keys(goodCGObj).forEach(function(cc){
				if(goodCGObj[cc][1] > 0 && Math.floor(goodCGObj[cc][0]/goodCGObj[cc][1]) === +d){
					displayRows.push(cc);
				}
			});
		}
		// add header
		addDetailsHeader();
		// focus on the details div
		detailsDiv.node().scrollIntoView();
		// show display data
		sortDetailsData();
	}
	
	function rectMouseOver(d){
		dOut = d;
		svgElem.selectAll(".column_rect").style("opacity", function(d){
			if(dOut === d){
				return 1;
			}else{
				return 0.1;
			}
		});
		svgElem.selectAll(".column_num").style("display", function(d){
			if(dOut === d){
				return null;
			}else{
				return "none";
			}
		});
	}
	
	function rectMouseOut(){
		svgElem.selectAll(".column_rect").style("opacity", 1);
		svgElem.selectAll(".column_num").style("display", "none");
	}
	
	function topGMouseEnter(){
		tooltip.selectAll("*").remove();
		tooltip.html(d3.select(this).attr("data_title"));
		showTooltip(tooltip, d3.event.pageX + 2, d3.event.pageY + 2);
		setTimeout(hideTitle, 1000);
		svgElem.selectAll(".top_g").style("opacity", 0.1);
		d3.select(this).style("opacity", 1);
		
		let lowCutOff = type === "string" ? ALL_GRADES.indexOf(lowGradesSel.node().value) : +lowCgSel.node().value,
			topCutoff = type === "string" ? ALL_GRADES.indexOf(topGradesSel.node().value) : +topCgSel.node().value;
			
		switch(d3.select(this).attr("data_title")){
			case "Low Grades Percent":
				svgElem.selectAll(".column_rect").style("opacity", function(d){
					if(colsArr.indexOf(d) <= lowCutOff){
						return 1;
					}else{
						return 0.1;
					}
				});
				svgElem.selectAll(".column_num").style("display", function(d){
					if(colsArr.indexOf(d) <= lowCutOff){
						return null;
					}else{
						return "none";
					}
				});
				break;
			case "Low CG/SG Percent":
				svgElem.selectAll(".column_rect").style("opacity", function(d){
					if(d < lowCutOff){
						return 1;
					}else{
						return 0.1;
					}
				});
				svgElem.selectAll(".column_num").style("display", function(d){
					if(d < lowCutOff){
						return null;
					}else{
						return "none";
					}
				});
				break;
			case "Median":
				if(type === "string"){
					svgElem.selectAll(".column_rect").style("opacity", function(d){
						if(colsArr.indexOf(d) === median){
							return 1;
						}else{
							return 0.1;
						}
					});
					svgElem.selectAll(".column_num").style("display", function(d){
						if(colsArr.indexOf(d) === median){
							return null;
						}else{
							return "none";
						}
					});							
				}else{
					svgElem.selectAll(".column_rect").style("opacity", 0.1);
					let xCoord = xScale(Math.floor(median)) + ((median - Math.floor(median)) * colWidth);
					// prepare a line
					appendLine(svgElem, xCoord, margins.top, xCoord, (hSvg - margins.bottom), "red", 1, "temp_g");
					// append text
					appendText(svgElem, {"xCord":xCoord, "yCord":(margins.top - 2), "textAnchor":"middle", "txt":formatDecimal3(median), "fontClass":"temp_g", "fontColor":"red"});								
				}
				break;
			case "Inter-Quartile Range (IQR)":
				if(type === "string"){
					svgElem.selectAll(".column_rect").style("opacity", function(d){
						if(colsArr.indexOf(d) === percentile25 || colsArr.indexOf(d) === percentile75){
							return 1;
						}else{
							return 0.1;
						}
					});
					svgElem.selectAll(".column_num").style("display", function(d){
						if(colsArr.indexOf(d) === percentile25 || colsArr.indexOf(d) === percentile75){
							return null;
						}else{
							return "none";
						}
					});
					
					appendLine(svgElem, (xScale(percentile25) + (colWidth/2)), (yScale(0) + 25), (xScale(percentile75) + (colWidth/2)), (yScale(0) + 25), colors10[0], 1, "temp_g");
					
					appendEquilateralTriangle(svgElem, (xScale(p25) + (colWidth/2)), (yScale(0) + 25), (0.1 * blockWidth), "left", colors10[0], "temp_g");
					
					appendEquilateralTriangle(svgElem, (xScale(p75) + (colWidth/2)), (yScale(0) + 25), (0.1 * blockWidth), "right", colors10[0], "temp_g");
				}else{
					svgElem.selectAll(".column_rect").style("opacity", 0.1);
					svgElem.selectAll(".column_num").style("display", "none");
					
					let p25XCoord = xScale(Math.floor(p25)) + ((p25 - Math.floor(p25)) * colWidth);
					let p75XCoord = xScale(Math.floor(p75)) + ((p75 - Math.floor(p75)) * colWidth);
					
					appendLine(svgElem, p25XCoord, (yScale(0) + 25), p75XCoord, (yScale(0) + 25), "red", 1, "temp_g");
					
					appendEquilateralTriangle(svgElem, p25XCoord, (yScale(0) + 25), (0.1 * blockWidth), "left", "red", "temp_g");
					
					appendEquilateralTriangle(svgElem, p75XCoord, (yScale(0) + 25), (0.1 * blockWidth), "right", "red", "temp_g");
					
					appendLine(svgElem, p75XCoord, margins.top, p75XCoord, (hSvg - margins.bottom), "red", 1, "temp_g");
					
					appendText(svgElem, {"xCord":p75XCoord, "yCord":(margins.top - 2), "textAnchor":"start", "txt":formatDecimal3(p75), "fontClass":"temp_g", "fontColor":"red"});
					
					appendLine(svgElem, p25XCoord, margins.top, p25XCoord, (hSvg - margins.bottom), "red", 1, "temp_g");
					
					appendText(svgElem, {"xCord":p25XCoord, "yCord":(margins.top - 2), "textAnchor":"end", "txt":formatDecimal3(p25), "fontClass":"temp_g", "fontColor":"red"});
					//appendText(svgElem, {"xCord":p25XCoord, "yCord":(margins.top - 2), "textAnchor":"end", "fontSize":, "fontWeight":, "txt":, "fontClass":, "fontColor":, "fontDisplay":, "fontData":})
				}
				
				break;
			case "High Grades Percent":
				svgElem.selectAll(".column_rect").style("opacity", function(d){
					if(colsArr.indexOf(d) >= topCutoff){
						return 1;
					}else{
						return 0.1;
					}
				});
				svgElem.selectAll(".column_num").style("display", function(d){
					if(colsArr.indexOf(d) >= topCutoff){
						return null;
					}else{
						return "none";
					}
				});
				break;
			case "High CG/SG Percent":
				svgElem.selectAll(".column_rect").style("opacity", function(d){
					if(d >= topCutoff){
						return 1;
					}else{
						return 0.1;
					}
				});
				svgElem.selectAll(".column_num").style("display", function(d){
					if(d >= topCutoff){
						return null;
					}else{
						return "none";
					}
				});
				break;
		}
	}
	
	function hideTitle(){
		tooltip.style("left","-1000px").style("top","-1000px");
	}
	
	function topGMouseLeave(){
		hideTitle();
		svgElem.selectAll(".top_g").style("opacity", 1);
		svgElem.selectAll(".column_rect").style("opacity", 1);
		svgElem.selectAll(".column_num").style("display", "none");
		svgElem.selectAll(".temp_g").remove();
	}
}

function addDetailsRow(rowElem, rowData){
	if(displayRowsType === 'grades'){
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData[gradesArrStudCol]);
							
		rowElem.append("td")
				.style("width", "20%")
				.html(allStudentsObj[rowData[gradesArrStudCol]]['name']);					
							
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData[gradesArrCourseCol]);
	
		rowElem.append("td")
				.style("width", "30%")
				.html(allCoursesObj[rowData[gradesArrCourseCol]]['name']);
		
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData[gradesArrYearCol]);
		
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData[gradesArrSemCol]);
		
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData[gradesArrGradeCol]);
	}
	if(displayRowsType === 'cg'){
		rowElem.append("td")
				.style("width", "10%")
				.html(rowData);
							
		rowElem.append("td")
				.style("width", "20%")
				.html(allStudentsObj[rowData]['name']);
				
		rowElem.append("td")
				.style("width", "10%")
				.html(formatDecimal3(goodCGObj[rowData][0]/goodCGObj[rowData][1]));
				
		tempDetailsDiv = rowElem.append("td")
							.style("width", "60%")
							.append("div")
								.style("width", "100%");
		// add header table
		tempTR = tempDetailsDiv.append("div")
								.style("padding-right", "20px")
									.append("table")
									.style("table-layout", "fixed")
									.style("width","100%")
									.style("margin-right", "40px")
									.append("tbody")
										.append("tr")
										.style("font-weight", "bold");
		
		[["20%", "Course ID"],
		["20%", "Year"],
		["20%","Semester"],
		["20%", "Credit"],
		["20%", "Grade"]].forEach(function(xx){
			tempTR.append("td")
					.style("width", xx[0])
					.attr("class", "noselect _" + rowData + "_header_td")
					.datum([rowData, xx[1]])
					.on("click", sortTempDetailsData)
					.html(xx[1] === "Course ID" ? xx[1] + " &#8679;": xx[1]);
		});
		
		// add container div
		tempDiv = tempDetailsDiv.append("div")
								.style("width", "100%")
								.style("max-height", "200px")
								.style("border-top", "1px solid")
								.style("overflow-y", "scroll");
								
		tempTBody = tempDiv.append("table")
							.style("table-layout", "fixed")
							.style("width", "100%")
							.append("tbody");
		
		// sort the data by course ID
		goodCGObj[rowData][2].sort(function(a, b){
			return compareText(a[0], b[0]);
		});
		goodCGObj[rowData][2].forEach(function(xx){
			tempTR = tempTBody.append("tr")
								.attr("id","_" + rowData + "_" + xx[0] + "_" + xx[1] + "_" + xx[2]);
			xx.forEach(function(yy){
				tempTR.append("td")
						.style("width", "20%")
						.html(yy)

			});
		});
		if(tempDetailsSortedBy[rowData]){
			sortTempDetailsData([rowData, ""]);
		}
	}				
}

function addDetailsHeader(){
	detailsHeaderRow.selectAll("*").remove();
	if(displayRowsType === 'grades'){
		[["10 %", "Students ID"],
		["20%", "Student Name"],
		["10%","Course ID"],
		["30%","Course Name"],
		["10%","Year"],
		["10%","Semester"],
		["10%","Grade"]].forEach(function(xx){
			detailsHeaderRow.append("td")
							.style("width", xx[0])
							.attr("class", "noselect header_td")
							.datum(xx[1])
							.on("click", sortDetailsData)
							.html(xx[1]);
		});
	}
	if(displayRowsType === 'cg'){
		[["10 %", "Students ID"],
		["20%", "Student Name"],
		["10%","CG"],
		["60%","Course Details"]].forEach(function(xx){
			detailsHeaderRow.append("td")
							.style("width", xx[0])
							.attr("class", "noselect header_td")
							.datum(xx[1])
							.on("click", sortDetailsData)
							.html(xx[1]);
		});
	}
}
	
function appendLine(elem, x1Cord, y1Cord, x2Cord, y2Cord, lineCol, lineWidth, lineClass){
	elem.append("line")
		.attr("x1", x1Cord)
		.attr("y1", y1Cord)
		.attr("x2", x2Cord)
		.attr("y2", y2Cord)
		.attr("class", lineClass)
		.style("stroke",lineCol !== "" ? lineCol : null)
		.style("stroke-width",lineWidth);
}

function appendEquilateralTriangle(elem, startX, startY, sideLen, direction, col, tClass){
	switch(direction){
		case "left":
			elem.append("path")
				.attr("d", "M " + startX + ", " + startY + 
							// cos 30 is root(3)/2
							"L " + (startX + (sideLen * 0.5)) + ", " + (startY - (Math.sqrt(3) * 0.25 * sideLen)) + 
							"L " + (startX + (sideLen * 0.5)) + ", " + (startY + (Math.sqrt(3) * 0.25 * sideLen)) +
					"Z")
				.attr("class", tClass !== "" ? tClass : null)
				.style("fill", col);
			break;
		
		case "right":
			elem.append("path")
				.attr("d", "M " + startX + ", " + startY + 
							// cos 30 is root(3)/2
							"L " + (startX - (sideLen * 0.5)) + ", " + (startY + (Math.sqrt(3) * 0.25 * sideLen)) + 
							"L " + (startX - (sideLen * 0.5)) + ", " + (startY - (Math.sqrt(3) * 0.25 * sideLen)) +
					"Z")
				.attr("class", tClass !== "" ? tClass : null)
				.style("fill", col);
			break;
		
		case "up":
			elem.append("path")
				.attr("d", "M " + startX + ", " + startY + 
							// cos 30 is root(3)/2
							"L " + (startX + (sideLen * 0.5)) + ", " + (startY + (Math.sqrt(3) * 0.5 * sideLen)) + 
							"L " + (startX - (sideLen * 0.5)) + ", " + (startY + (Math.sqrt(3) * 0.5 * sideLen)) +
					"Z")
				.attr("class", tClass !== "" ? tClass : null)
				.style("fill", col);
			break;
	}
	
}

function showHideNames(){
	d3.selectAll(".bubble_name").style("display",function(){
		if(showNamesCheck.node().checked){
			return null;
		}else{
			return "none";
		}
	});
	adjustNameAndValues();
}

function showHideValues(){
	d3.selectAll(".bubble_value").style("display",function(){
		if(showValuesCheck.node().checked){
			return null;
		}else{
			return "none";
		}
	});
	adjustNameAndValues();			
}

function adjustNameAndValues(){
	if(showNamesCheck.node().checked && showValuesCheck.node().checked){
		d3.selectAll(".bubble_name").attr("dy","0em");
		d3.selectAll(".bubble_value").attr("dy","1em");
		return;
	}
	if(showNamesCheck.node().checked){
		d3.selectAll(".bubble_name").attr("dy","0.5em");
		return;
	}
	if(showValuesCheck.node().checked){
		d3.selectAll(".bubble_value").attr("dy","0.5em");
		return;
	}				
}

function showTooltip(elem, evX, evY){
	topY = window.visualViewport.pageTop;
	botY = window.visualViewport.pageTop + window.visualViewport.height;
	lefX = window.visualViewport.pageLeft;
	rigX = window.visualViewport.pageLeft + window.visualViewport.width;
	tooltipH = elem.node().scrollHeight;
	tooltipW = elem.node().scrollWidth;
	
	if(botY - evY < tooltipH){
		if(evY - topY > tooltipH){
			evY = evY - tooltipH - 20;
		}else{
			evY = evY + 10;
		}
	}

	if(rigX - evX < tooltipW){
		if(evX - lefX > tooltipW){
			evX = evX - tooltipW - 20;
		}else{
			evX = evX + 10;
		}
	}
	
	elem.style("left",evX + "px")
			.style("top",evY + "px")
			.style("opacity",0.95);				
}

function updateDetailsDiv(d, rFlag){
	displayData = [];
	prevButton.property("disabled", true);
	let yy,
		zLevel;
	if(radioCategory.node().checked){
		if(radioCountry.node().checked || radioVType.node().checked){
			zLevel = 0;
		}else{
			zLevel = treeZoomLevel;
		}
	}

	if(radioCategoryScore.node().checked){
		zLevel = scoreZoomLevel;
	}

	if(radioFiling.node().checked){
		zLevel = filingZoomLevel;
		yy = d[1];
		d = d[0];	
	}
	
	goodData.forEach(function(gd,gi){
		let allow = false;
		let ratingAndCategoryAllow, costAllow;
		if(rFlag){
			if(d[0] === "competitor"){
				if(gd["rejecting"].length + gd["rejected"].length < 1) return;
				if(gd["rejecting"].length > 0){
					gd["rejecting"].forEach(function(rr,ri){
						if(rr[0] === d[1]){
							allow = true;
						}
					});
				}
				if(gd["rejected"].length > 0){
					gd["rejected"].forEach(function(rr,ri){
						if(rr[0] === d[1]){
							allow = true;
						}
					});							
				}							
			}
			if(d[0] === "rejecting"){
				if(gd["rejecting"].length === 0){
					return;
				}else{
					gd["rejecting"].forEach(function(rr,ri){
						if(rr[0] === d[1] && gd["primary_tier_1"] === d[2]){
							allow = true;
						}
					});
				}						
			}
			if(d[0] === "rejected"){
				if(gd["rejected"].length === 0){
					return;
				}else{
					gd["rejected"].forEach(function(rr,ri){
						if(rr[0] === d[1] && gd["primary_tier_1"] === d[2]){
							allow = true;
						}
					});
				}
			}
			if(d[0] === "inventor"){
				if(gd["inventors"].indexOf(d[1]) >= 0){
					allow = true;
				}
			}
			if(d[0] === "inventor_category"){
				if(gd["inventors"].indexOf(d[1]) >= 0 && gd["primary_tier_1"] === d[2]){
					allow = true;
				}
			}
			if(d[0] === "renewal_category"){
				if(gd["primary_tier_1"] === d[1]){
					allow = true;
				}
			}
			
			if(d[0] === "renewal_bar"){
				ratingAndCategoryAllow = false;
				costAllow= false;
				if(gd["primary_tier_1"] === d[1][0] && gd["rating"] === d[1][1]){
					ratingAndCategoryAllow = true;
				}
				switch(d[1][2]){
					case "cost_1":
						if(gd["projected_amount"] < 300){
							costAllow = true;
						}
						break;
					case "cost_2":
						if(gd["projected_amount"] >= 300 && gd["projected_amount"] <= 3000){
							costAllow = true;
						}
						break;
					case "case_3":
						if(gd["projected_amount"] > 3000){
							costAllow = true;
						}
						break;
				}
				allow = ratingAndCategoryAllow && costAllow;
			}
			if(d[0] === "country"){
				if(gd["country"] === d[1][0] && gd["primary_tier_1"] === d[1][1]){
					allow = true;
				}
			}
			if(d[0] === "vtype"){
				if(gd[d[1][0]] === 1 && gd["primary_tier_1"] === d[1][1]){
					allow = true;
				}
			}
			if(d[0] === "target"){
				if(gd["targets"].indexOf(d[1]) >= 0){
					allow = true;
				}						
			}
			if(d[0] === "target_category"){
				if(gd["targets"].indexOf(d[1]) >= 0 && gd["primary_tier_1"] === d[2]){
					allow = true;
				}						
			}						
		}else{
			if(zLevel === 0){
				if(gd["primary_tier_1"] === d.data.data.name){
					allow = true;
				}
			}
			if(zLevel === 1){
				if(radioSubCategories.node().checked){
					if(gd["primary_tier_1"] === d.parent.data.data.name && gd["primary_tier_2"] === d.data.data.name){
						allow = true;
					}							
				}else{
					nn = d.data.data.name;
					if(gd["primary_tier_1"] === d.parent.data.data.name && (gd["secondary_tier_1"] === nn.substring(0, nn.length - 1) || gd["tertiary_tier_1"] === nn.substring(0, nn.length - 1))){
						allow = true;
					}							
				}
			}
			if(radioFiling.node().checked){
				if(gd["filing_year"] != yy){
					allow = false;
				}
			}
			if(radioCategoryScore.node().checked){
				if(radioRatingHigh.node().checked){
					if(gd["rating"] != "H"){
						allow = false;
					}
				}else{
					if(gd["rating"] != "L"){
						allow = false;
					}							
				}
			}
		}

		if(allow){
			displayData.push(gd);
		}
	});
	if(displayData.length < pageSize){
		prevButton.style("display", "none");
		nextButton.style("display", "none");
	}else{
		prevButton.style("display", null);
		nextButton.style("display", null);
	}
	sortDetailsData();
	detailsDiv.node().scrollIntoView();
}

function exportData(){
	if(!displayRows || displayRows.length === 0) return;
	let csvContent = "";
		
	// get the header
	if(displayRowsType === 'grades'){
		csvContent = csvContent + "Student ID, Student Name, Course ID, Course Name, Year, Semester, Grade";
	}else{
		csvContent = csvContent + "Student ID, Student Name, CG, Course ID, Year, Semester, Credit, Grade";
	}
					
	csvContent = csvContent + "\r\n";
	displayRows.forEach(function(dd){
		if(displayRowsType === 'grades'){
			csvContent = csvContent + dd[gradesArrStudCol] + ",";
			csvContent = csvContent + allStudentsObj[dd[gradesArrStudCol]]['name'] + ",";
			csvContent = csvContent + dd[gradesArrCourseCol] + ",";
			csvContent = csvContent + allCoursesObj[dd[gradesArrCourseCol]]['name'] + ",";
			csvContent = csvContent + dd[gradesArrYearCol] + ",";
			csvContent = csvContent + dd[gradesArrSemCol] + ",";
			csvContent = csvContent + dd[gradesArrGradeCol];
			csvContent = csvContent + "\r\n";
		}else{
			goodCGObj[dd][2].forEach(function(xx){
				csvContent = csvContent + dd+ ",";
				csvContent = csvContent + allStudentsObj[dd]['name'] + ",";
				csvContent = csvContent + formatDecimal3(goodCGObj[dd][0]/goodCGObj[dd][1]) + ",";
				xx.forEach(function(yy, yi){
					if(yi < 4){
						csvContent = csvContent + yy + ",";
					}else{
						csvContent = csvContent + yy + "\r\n";
					}
				});
			});					
		}
	});
	
	var blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
			type: "text/csv;charset=utf-8;"
		});
	// For IE (tested 10+)
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, 'export.csv');
	} else {
		var a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
		a.download = "export.csv";
		document.body.appendChild(a);
		a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
		document.body.removeChild(a);
	}
}

function showDisplayData(){
	detailsTableBody.selectAll("*").remove();
	if(displayRows.length === 0) return;
	let rowIndex;
	let maxRowIndex = displayRowIndex + pageSize - 1;
	if(maxRowIndex >= displayRows.length){
		maxRowIndex = displayRows.length - 1;
	}
	numSpan.html((displayRowIndex + 1) + " to " + (maxRowIndex + 1) + " of " + displayRows.length);
	for(rowIndex = displayRowIndex; rowIndex <= maxRowIndex; rowIndex++){
		newRow = detailsTableBody.append("tr")
								.style("background-color",(rowIndex%2 === 1?"#e6f2ff":"#ffffff"));	// cce6ff - blue, d9d9d9 - gray, e6f2ff - lighter blue
		addDetailsRow(newRow, displayRows[rowIndex]);
	}
}

function addTd(elem, width, tdText){
	elem.append("td").append("div")
					.attr("class", "overflow_hidden")
					.style("width", width)
					.datum(tdText)
					.html(tdText);
}
			
function prepareNameAsID(name){
	return name.replace(/[& \/.;-]/g, "_");
}

function prepareGoodData(){
	let t = new Date();
	goodStudents = [];
	goodCourses = [];
	goodGrades = [];
	goodGradesArr = [];
	goodCGArr = [];
	goodCGObj = {};
	allStudentsArr.forEach(function(ss, si){
		// check batch year
		if(allStudentsObj[ss]["batchYear"] < +lowerBatchYear.node().value || allStudentsObj[ss]["batchYear"] > +upperBatchYear.node().value){
			return;
		}
		
		// check gender
		if(studentsGenderSel.node().value != "both" && allStudentsObj[ss]["gender"] != studentsGenderSel.node().value){
			return;
		}
		
		// check dep
		if(studentsDepSel.node().value != "all"){
			if(studentsDepNotCheck.node().checked){
				if(allStudentsObj[ss]["dep"] === studentsDepSel.node().value){
					return;
				}
			}else{
				if(allStudentsObj[ss]["dep"] != studentsDepSel.node().value){
					return;
				}
			}
		}
		
		// check city
		if(studentsCitySel.node().value != "all"){
			if(studentsCityNotCheck.node().checked){
				if(allStudentsObj[ss]["city"] === studentsCitySel.node().value){
					return;
				}
			}else{
				if(allStudentsObj[ss]["city"] != studentsCitySel.node().value){
					return;
				}
			}
		}
		
		// check language
		if(studentsJeeSel.node().value != "all"){
			if(studentsJeeNotCheck.node().checked){
				if(allStudentsObj[ss]["lang"] === studentsJeeSel.node().value){
					return;
				}
			}else{
				if(allStudentsObj[ss]["lang"] != studentsJeeSel.node().value){
					return;
				}
			}
		}
		
		// check program
		if(studentsProgSel.node().value != "all"){
			if(studentsProgNotCheck.node().checked){
				if(allStudentsObj[ss]["prog"] === studentsProgSel.node().value){
					return;
				}
			}else{
				if(allStudentsObj[ss]["prog"] != studentsProgSel.node().value){
					return;
				}
			}
		}
		
		// check category
		if(studentsCatSel.node().value != "all"){
			if(studentsCatNotCheck.node().checked){
				if(allStudentsObj[ss]["cat"] === studentsCatSel.node().value){
					return;
				}
			}else{
				if(allStudentsObj[ss]["cat"] != studentsCatSel.node().value){
					return;
				}
			}
		}
		
		goodStudents.push(ss);
		goodCGObj[ss] = [0, 0, []];
	});
	
	console.log("prepared good students in ", new Date() - t);
	t = new Date();
	allCoursesArr.forEach(function(cc,ci){
		// check dep
		if(coursesDepSel.node().value != "all"){
			if(coursesDepNotCheck.node().checked){
				if(allCoursesObj[cc]["dep"] === coursesDepSel.node().value){
					return;
				}
			}else{
				if(allCoursesObj[cc]["dep"] != coursesDepSel.node().value){
					return;
				}
			}
		}
		
		// check course
		if(coursesCourseSel.node().value != "all"){
			if(coursesCourseNotCheck.node().checked){
				if(cc === coursesCourseSel.node().value){
					return;
				}
			}else{
				if(cc != coursesCourseSel.node().value){
					return;
				}
			}
		}
		goodCourses.push(cc);
	});
	
	console.log("prepared good courses in ", new Date() - t);
	t = new Date();
	
	let tt = new Date();
	console.log(gradesArrYearCol, gradesArrSemCol, gradesArrStudCol, gradesArrCourseCol, gradesArrGradeCol);
	gradeFileArr.forEach(function(gg, gi){
		if(gi === 0) return;
		// check if student is in good students
		if(goodStudents.indexOf(gg[gradesArrStudCol]) < 0){
			return;
		}
		
		// check if course is in good courses
		if(goodCourses.indexOf(gg[gradesArrCourseCol]) < 0){
			return;
		}
		// check course year
		if(+gg[gradesArrYearCol] < +lowerCourseYear.node().value || +gg[gradesArrYearCol] > +upperCourseYear.node().value){
			return;
		}
		// check semester
		if(courseSemesterSel.node().value !== "0"){
			if(gg[gradesArrSemCol] !==  courseSemesterSel.node().value){
				return;
			}
		}
		goodGrades.push(gg);
		goodGradesArr.push(gg[gradesArrGradeCol]);
		goodCGObj[gg[gradesArrStudCol]][0] = goodCGObj[gg[gradesArrStudCol]][0] + (allCoursesObj[gg[gradesArrCourseCol]]['credit'] *  GRADE_VALUES[gg[gradesArrGradeCol]]);
		goodCGObj[gg[gradesArrStudCol]][1] = goodCGObj[gg[gradesArrStudCol]][1] + allCoursesObj[gg[gradesArrCourseCol]]['credit'];
		
		goodCGObj[gg[gradesArrStudCol]][2].push([gg[gradesArrCourseCol], gg[gradesArrYearCol], gg[gradesArrSemCol], allCoursesObj[gg[gradesArrCourseCol]]['credit'], gg[gradesArrGradeCol]]);
	});
	
	console.log("prepared good grades in ", new Date() - t);
	t = new Date();
	
	goodStudents.forEach(function(ss){
		if(goodCGObj[ss][1] > 0){
			goodCGArr.push(goodCGObj[ss][0]/ goodCGObj[ss][1]);
		}
	});
	console.log("prepared good CG Arr in ", new Date() - t);
}