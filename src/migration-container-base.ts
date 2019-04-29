import {injectable} from "inversify";
import {IMigrationContainer} from "./declaration";

@injectable()
export abstract class MigrationContainerBase implements IMigrationContainer {
    public static version: string;

    public abstract down(): Promise<void> | void;

    public abstract up(): Promise<void> | void;
}
