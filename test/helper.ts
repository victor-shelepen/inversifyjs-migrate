import {injectable} from 'inversify';
import {ICurrentVersionContainer} from '../src/declaration';


@injectable()
export class CurrentVersionContainer implements ICurrentVersionContainer {
    private version = '0.0.6';

    async getVersion(): Promise<string> {
        return this.version;
    }

    async setVersion(version: string): Promise<void> {
        this.version = version;
    }
}
