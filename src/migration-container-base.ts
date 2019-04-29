import {injectable} from 'inversify';
import {IMigrationContainer} from './declaration';

@injectable()
export abstract class MigrationContainerBase implements IMigrationContainer {
    public static version: string;

    abstract down(): Promise<void> | void;

    abstract up(): Promise<void> | void;
}
