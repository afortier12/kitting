const Integrity = {}
const params = new URLSearchParams(window.location.search)

Integrity.standardSuccess = (data) => {
	toastr.success("Loaded")
}

Integrity.standardDebugSuccess = (data) => {
	console.log(data)
	toastr.success("Loaded")
}

Integrity.standardError = (err) => {
	toastr.error(err.responseText)
}

Integrity.standardDebugError = (err) => {
	console.log(err)
	toastr.error(err.responseText)
}

Integrity.get = (url, success = Integrity.standardSuccess, error = Integrity.standardError) => {
	$.ajax({
		url: url,
		success: success,
		error: error
	})
}


Integrity.post = (url, data = null, success = Integrity.standardDebugSuccess, error = Integrity.standardError) => {
	$.ajax({
		url: url,
		method: "POST",
		data: data ? JSON.stringify(data) : null,
		success: success,
		error: error
	})
}

Integrity.getDebug = (url, success = Integrity.standardDebugSuccess, error = Integrity.standardDebugError) => {
	$.ajax({
		url: url,
		success: success,
		error: error
	})
}


Integrity.postDebug = (url, data = null, success = Integrity.standardSuccess, error = Integrity.standardDebugError) => {
	$.ajax({
		url: url,
		method: "POST",
		data: data ? JSON.stringify(data) : null,
		success: success,
		error: error
	})
}

Integrity.daysBetween = (date1, date2) => {
	if(date1 instanceof moment && date2 instanceof moment){
		return Math.abs(date1.diff(date2, 'days'))
	}
	return Math.abs(moment(date1).diff(moment(date2), 'days'))
}

Integrity.isoDate = (date) => {
	if(date instanceof moment){
		return date.format('YYYY-MM-DD')
	}
	return moment(date).format('YYYY-MM-DD')
}

Integrity.roundTo = (num, digit) => {
	return +(Math.round(num + `e+${digit}`)  + `e-${digit}`)
}

Integrity.urlParams = (name) => {
	return params.get(name)
}

Integrity.setCookie = (field, value, path = "/") => {
	document.cookie = `${field}=${value}; path=${path}; SameSite=Strict;`
}

Integrity.getCookie = (field) => {
	var value = "; " + document.cookie
	var parts = value.split("; " + field + "=")
	if (parts.length == 2) return parts.pop().split(";").shift()
}

Integrity.setState = (field, value) => {
	localStorage.setItem(field, value)
}

Integrity.getState = (field) => {
	return localStorage.getItem(field)
}

Integrity.replaceURL = (url) => {
	window.history.replaceState({}, 'foo', url)
}

ilib = Integrity