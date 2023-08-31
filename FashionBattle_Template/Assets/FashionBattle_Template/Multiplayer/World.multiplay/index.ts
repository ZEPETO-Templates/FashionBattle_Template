import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";

export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        this.onMessage("PlayerData", (client, message) => {
            // const player = new Player();
        }
    }

    onJoin(client: SandboxPlayer) {
        const player = new Player();
        player.sessionId = client.sessionId;
        if (client.hashCode) {
            player.zepetoHash = client.hashCode;
        }
        if (client.userId) {
            player.zepetoUserId = client.userId;
        }
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        
    }
}