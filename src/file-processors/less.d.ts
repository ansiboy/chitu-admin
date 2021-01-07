import { RequestContext, RequestProcessor, RequestResult } from "maishu-node-web-server";
export declare class LessProcessor implements RequestProcessor {
    execute(ctx: RequestContext): Promise<RequestResult>;
}
