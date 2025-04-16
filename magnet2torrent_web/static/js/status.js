document.querySelector("form").addEventListener("submit", function () {
    const progressBar = document.getElementById("progress");
    progressBar.hidden = false;
});

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    const progressBar = document.getElementById("progress");
    progressBar.hidden = true;

    if (status === "success") {
        const snackbarContainer = document.querySelector("#snackbar");
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "Torrent file created successfully!",
        });
    } else if (status === "error") {
        const snackbarContainer = document.querySelector("#snackbar");
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "Error occurred during conversion.",
        });
    }
});
