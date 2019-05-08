import { isPresent } from '@ember/utils';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'immunizationRegistryConnectionPropertyGuid',

    serialize(snapshot) {
        const ironBridgePropertyValue = (snapshot.attr('ironBridgePropertyValue') || '').trim();

        return {
            immunizationRegistryConnectionPropertyGuid: snapshot.id,
            ironBridgePropertyId: snapshot.attr('ironBridgePropertyId'),
            ironBridgePropertyValue: isPresent(ironBridgePropertyValue) ? ironBridgePropertyValue : null
        };
    }
});
