const { commonjsToAmd } = require("../js-transform");

describe('commonjsToAmd', function () {

    it("commonjsToAmd", function () {
        let code = `const maishu_jueying_1 = require("maishu-jueying");
    const carousel_1 = require("app/components/carousel");
    const React = require("react");
    const ui = __importStar(require("maishu-ui-toolkit"));
    const image_manager_1 = __importDefault(require("../controls/image-manager"));
    const image_service_1 = require("../../services/image-service");
    const static_1 = require("maishu-chitu-admin/static");`;
        let r = commonjsToAmd(code);
        console.log(r);
    })
})