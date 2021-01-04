import { Page } from "maishu-chitu-react";


export default function (page: Page) {

    let targetURL = page.data.target as string;
    let a = document.createElement("a");
    a.href = targetURL;
    let name = a.pathname;

    let iframe = page.element.querySelector(`[name="${name}"]`) as HTMLIFrameElement;
    if (iframe == null) {
        iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.border = "none";
        iframe.src = targetURL;
        iframe.name = name;

        let d = page.app.parseUrl(targetURL);

        // if (d.values.height)
        //     iframe.height = d.values.height as string;

        page.element.appendChild(iframe);
    }

    let iframes = page.element.querySelectorAll("iframe");
    for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].name == name) {
            iframes[i].style.removeProperty("display");
            updateSize(iframes[i]);
            continue;
        }
        iframes[i].style.display = "none";
    }

    window.addEventListener("resize", () => {
        let iframes = page.element.querySelectorAll("iframe");
        for (let i = 0; i < iframes.length; i++) {
            updateSize(iframes[i]);
        }
    })

}

function updateSize(element: HTMLIFrameElement) {
    element.style.height = `${window.innerHeight - 60}px`;
}
