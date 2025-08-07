

const corsOptions={
    origin:["http://localhost:5173","http://localhost:4173",process.env.CLIENT_URL],
    credentials:true,
    methods:['GET',"POST","PUT","DELETE"],
};

const CHATU_TOKEN="chatu-token";

export {corsOptions,CHATU_TOKEN};