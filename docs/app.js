window.onload = function () {
    var filedrop = document.getElementById("filedrop");

    window.addEventListener("start-parsing", function (event) {
        var input = event.detail;

        if (!input) {
            document.getElementById("result").innerHTML = "No file input provided.";
            document.getElementById("result").className = "fail";
            return;
        }

        try {
            var result = jsonlint.parse(input);

            if (result) {
                document.getElementById("result").innerHTML = "JSON is valid!";
                document.getElementById("result").className = "pass";

                document.getElementById("source").value = JSON.stringify(result, null, 4);
            }
        }
        catch(err) {
            document.getElementById("result").innerHTML = err;
            document.getElementById("result").className = "fail";
        }
    }, false);


    document.getElementById("button").onclick = function () {
        var input = document.getElementById("source").value;
        var event = new CustomEvent("start-parsing", { "detail": input });

        window.dispatchEvent(event);
    };


    filedrop.ondragover = function () {
        this.classList.add("hover");
        return false;
    };

    filedrop.ondragleave = function () {
        this.classList.remove("hover");
        return false;
    };

    filedrop.ondrop = function (event) {
        if (typeof window.FileReader === "undefined") {
            alert("The browser does not support file drag & drop.");
            return;
        }

        this.classList.remove("hover");
        event.preventDefault();

        var files = event.dataTransfer.files;

        for (var i = 0; i < files.length; i++) {
            processFile(files[i]);
        }

        return false;
    };


    // Create a fileReader for every file to prevent:
    // > Failed to execute 'readAsText' on 'FileReader': The object is already busy reading Blobs.
    function processFile(file) {
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function (event) {
            document.getElementById("source").value = event.target.result;

            var event = new CustomEvent("start-parsing", { "detail": event.target.result });
            window.dispatchEvent(event);
        };
    }
}
