// Header description
// ---------------------
const links = Array.from(document.getElementsByClassName("link"))
const pages = Array.from(document.getElementsByTagName("page"))

function setPage(index) {
	for (const page of pages) {
		page.classList.add("hidden")
		page.classList.remove("active")
	}
	const currentPage = document.getElementById(links[index].innerText)
	currentPage.classList.remove("hidden")
	currentPage.classList.add("active")
}

function addEventListeners() {
	for (let i = 0; i < links.length; i++) {
		links[i].addEventListener("click", () => setPage(i))
	}
}

addEventListeners()

// ---------------------



// Header description
// ---------------------
const descriptionElement = document.getElementById("descriptions")
const descriptions = [
	"Full Stack Web Developer",
	"UI/UX Designer",
	"HS Student",
	"Competitive Programmer",
	"AI Developer",
	"Musician"
]
let currentDescriptionIndex = 0

// Progress in typing description
// 0-desc.length = characters
// desc.length + 1-5 = wait 1-5
let progress = 0

// Direction of progress
// 1 = forwards
// -1 = backwards
let direction = 1

function nextDescription() {
	const description = descriptions[currentDescriptionIndex]

	// Set description text
	if (progress <= description.length) {
		descriptionElement.innerText = description.substring(0, progress)
	}

	// Change direction if needed
	if (progress == description.length + 10) {
		direction = -1
	}

	// Update progress based on current direction
	progress += direction

	if (progress == 0) {
		// Increment Description Index
		currentDescriptionIndex++
		currentDescriptionIndex %= descriptions.length

		// Reset direction
		direction = 1
	}
}

function cycleDescriptions() {
	setInterval(nextDescription, 50)
}

cycleDescriptions()

// ---------------------



// Logo Cloud
// ---------------------
const logos = Array.from(document.getElementsByClassName("image-container"))
const CLOUD_RADIUS = 130

const cloud = document.getElementById("cloud")
const MAX_ROT_SPEED = 0.015

function sin(x) {
	return Math.sin(x)
}

function cos(x) {
	return Math.cos(x)
}

function generatePoints(n, radius) {
	let points = []
	const RADIAN_PHI = Math.PI * (3 - Math.sqrt(5))

	for (let i = 0; i < n; i++) {
		// Distribute x values from -radius to radius
		const x = radius * (2*(i / (n-1)) - 1)

		// Calculate radius of slice of circle with x by pythagorean theorem
		const slice_radius = Math.sqrt(radius**2 - x**2)

		// Calculate angle using golden angle increments
		const theta = i * RADIAN_PHI

		// Calculate y and z with known values
		const y =  slice_radius * cos(theta)
		const z = slice_radius * sin(theta)

		// Add point to point list
		points.push([x, y, z])
	}

	return points
}

function placeLogos(points) {
	for (let i = 0; i < points.length; i++) {
		logos[i].setAttribute("style", `transform: translate3d(${points[i][1]}px, ${points[i][0]}px, ${points[i][2]}px); opacity: ${(points[i][2]+CLOUD_RADIUS)/CLOUD_RADIUS}; z-index: ${Math.round(points[i][2])};`)
	}
}

function rotatePoints(points, x, y, z) {
	// Define 3x3 rotation matrix
	const rotationMatrix = [
		[cos(y)*cos(z), sin(x)*sin(y)*cos(z) - cos(x)*sin(z), cos(x)*sin(y)*cos(z) + sin(x)*sin(z)],
		[cos(y)*sin(z), sin(x)*sin(y)*sin(z) + cos(x)*cos(z), cos(x)*sin(y)*sin(z) - sin(x)*cos(z)],
		[-1*sin(y), sin(x)*cos(y), cos(x)*cos(y)]
	]

	// Computes the dot product of 2 vectors of size 3
	const vector3Dot = (vec1, vec2) => vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]

	// Create a function that rotates each point using the rotation matrix
	const rotatePoint = (point) => [vector3Dot(point, rotationMatrix[0]), vector3Dot(point, rotationMatrix[1]), vector3Dot(point, rotationMatrix[2])]

	// Rotates each point
	let out = []
	for (let point of points) {
		out.push(rotatePoint(point))
	}

	return out
}

let xRot = MAX_ROT_SPEED/3
let yRot = MAX_ROT_SPEED/4

function capRotation(rot) {
	if (rot < MAX_ROT_SPEED * -1) {
		return MAX_ROT_SPEED * -1
	} else if (rot > MAX_ROT_SPEED) {
		return MAX_ROT_SPEED
	} else {
		return rot
	}
}

function mouseMove(event) {
	const cloudX = cloud.getBoundingClientRect().x + cloud.clientWidth/2
	const cloudY = cloud.getBoundingClientRect().y + cloud.clientHeight/2

	xRot = capRotation(-1*MAX_ROT_SPEED*(event.clientX-cloudX)/(cloud.clientWidth))
	yRot = capRotation(MAX_ROT_SPEED*(event.clientY-cloudY)/(cloud.clientHeight))

	// Limit actual rotation amount to set max speed
	if (xRot**2 + yRot**2 > MAX_ROT_SPEED**2) {
		// Calculate a coefficient to multiply x and y rotation amounts
		const reductionCoef = Math.sqrt((MAX_ROT_SPEED**2)/(xRot**2 + yRot**2))

		// Scale rotation amounts to fit the maximum
		xRot = xRot*reductionCoef
		yRot = yRot*reductionCoef
	}
}

function animateLogos() {
	let points = generatePoints(15, CLOUD_RADIUS)
	placeLogos(points)

	const frame = () => {
		points = rotatePoints(points, xRot, yRot, 0)
		placeLogos(points)
	}

	setInterval(frame, 1000/60)
}

document.onmousemove = mouseMove

animateLogos()
// ---------------------

