import Component from '@ember/component';
import { computed, get, setProperties } from '@ember/object';

export default Component.extend({
    visConceptList: computed('vaccination.visConceptGuidList', 'visConcepts.[]', function () {
        const list = [...(get(this, 'vaccination.visConceptGuidList') || [])];
        const visConcepts = get(this, 'visConcepts') || [];
        return list.map(guid => visConcepts.findBy('visConceptGuid', guid));
    }),
    actions: {
        select() {
            const guidList = [...(get(this, 'visConceptList') || [])].map(concept => concept.id);
            setProperties(this, {
                'vaccination.visVersionDate': null,
                'vaccination.visConceptGuidList': _.uniq(guidList)
            });
        }
    }
});
