
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
        .register("/meals/sw.js")
        .then((reg) => {
            console.log('service worker registration success')
        })
        .catch((error) => {
            console.log('service worker registration error: ${error} ')
        });
    });
}
else {

}