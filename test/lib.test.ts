import {cleanUpMetadata, getMigrationsMetadata, migration} from '../src/lib';
import {IMigrationContainer} from '../src/declaration';
import {expect} from 'chai';

describe('Lib', () => {
    before(() => {
        cleanUpMetadata();

        const project = {
            state: 'State->0.0.6'
        };

        @migration('v0.0.7')
        class _0_0_7_Migration implements IMigrationContainer {
            up() {
                project.state = 'State->0.0.7'
            }

            down() {
                project.state = 'State->0.0.6'
            }
        }

        @migration('v0.0.8')
        class _0_0_8_Migration implements IMigrationContainer {
            up() {
                project.state = 'State->0.0.8'
            }

            down() {
                project.state = 'State->0.0.7'
            }
        }

    });

    it('Get migration metadata', () => {
        const migrationsMetadata = getMigrationsMetadata();
        expect(migrationsMetadata[0].name).equal('v0.0.8');
        expect(migrationsMetadata[1].name).equal('v0.0.7');
    });
});