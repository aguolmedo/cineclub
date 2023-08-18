

class base64Helper {
    public static decode(b64string) {
        const buff = Buffer.from(b64string,'base64');
        return buff.toString('utf-8');
    }
}

export default base64Helper;