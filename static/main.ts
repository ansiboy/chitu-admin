fetch("./website-config.json").then(async r => {
    let config = await r.json();
    requirejs.config(config.requirejs || {});
    requirejs(["application"]);

}).catch(err => {
    console.log(err);
})


