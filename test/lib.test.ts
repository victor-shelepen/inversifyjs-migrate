import {cleanUpMetadata, getMigrationsMetadata, migration} from '../src/lib';
import {IMigration} from '../src/declaration';
import {expect} from 'chai';

describe('Lib', () => {
    before(() => {
        cleanUpMetadata();

        const project = {
            state: 'State->0.0.0'
        };

        @migration('v0.0.1')
        class _0_0_1_Migration implements IMigration {
            up() {
                project.state = 'State->0.0.1'
            }

            down() {
                project.state = 'State->0.0.0'
            }
        }

        @migration('v0.0.2')
        class _0_0_2_Migration implements IMigration {
            up() {
                project.state = 'State->0.0.2'
            }

            down() {
                project.state = 'State->0.0.1'
            }
        }

    });

    it('Get migration metadata', () => {
        const migrationsMetadata = getMigrationsMetadata();
        expect(migrationsMetadata[0].name).equal('v0.0.2');
        expect(migrationsMetadata[1].name).equal('v0.0.1');
    });
});