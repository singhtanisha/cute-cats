import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
export default Component.extend({
    ignoreTitle: true,
    document: null,
    getReferenceMarkUp(ref) {
        return ref.attributes['id'].value;
    },
    getPubMedId(refId) {
        return $($.parseXML(this.get('xmlData'))).find(`reference[id=${refId}]`).find('pubmedid').text();
    },
    getParagraph(descriptionXML) {
        var ignoreNodeName = {'#comment': true},
            _this = this,
            paragraph = [],
            z, citeId, pubMedId, value;

        for (z = 0; z < descriptionXML.childNodes.length; z++) {
            //Only do node names that are not ignored
            if (!ignoreNodeName[descriptionXML.childNodes[z].nodeName]) {
                if (descriptionXML.childNodes[z].tagName === 'referenceref') {
                    citeId = _this.getReferenceMarkUp(descriptionXML.childNodes[z]);
                    pubMedId = _this.getPubMedId(citeId);
                    paragraph.push({
                        isReference: true,
                        value: citeId,
                        citeUrl: pubMedId ? 'http://www.ncbi.nlm.nih.gov/pubmed/' + pubMedId : undefined
                    });
                } else {
                    value = descriptionXML.childNodes[z].nodeValue.
                        replace(/(\r\n|\n|\r)/gm, '').
                        replace(/\s*/, '');
                    if (!isEmpty(value)) {
                        paragraph.push({isReference: false, value: value});
                    }
                }
            }
        }

        return paragraph;
    },
    onXmlData: on('init', observer('xmlData', function () {
        if (isEmpty(this.get('xmlData'))) {
            return;
        }

        this.set('document', [{ title: '', description: '' }]);

        const xml = $.parseXML(this.get('xmlData'));
        const paragraphs = $(xml).find('monograph');
        const includeList = [];
        const citations = [];
        let pubMedId;

        $(xml).find('reference').each((index, item) => {
            pubMedId = $(item).find('pubmedid').text();
            citations.push({
                refId: item.attributes['id'].value,
                citation: $(item).find('citation').text(),
                pubMedId,
                citeUrl: pubMedId ? `http://www.ncbi.nlm.nih.gov/pubmed/${pubMedId}` : undefined
            });
        });
        paragraphs.children().each((index, item) => {
            const description = [];
            const ignoreList = {
                alert: true,
                references: true,
                title: this.get('ignoreTitle'),
                managementlevels: true,
                documentationlevels: true,
                severitylevels: true,
                onsets: true,
                publishedinteractionlists: true,
                labeledavoidancelevels: true
            };
            let x;

            // Make sure they are not in the ignore list
            if (!ignoreList[item.tagName]) {
                for (x = 0; x < $(item).find('para').length; x++) {
                    description.push({ paragraphs: this.getParagraph($(item).find('para')[x]) });
                }

                includeList.push({
                    title: item.tagName.capitalize(),
                    description
                });
            }
        });

        this.set('document', {
            paragraphs: includeList,
            citations
        });
    })),
    actions: {
        scrollToCitations() {
            var scroller = $('.detail-pane-body-wrapper'),
                elementOffset = this.$('.citations').offset();
            if (!elementOffset) {
                return;
            }
            scroller.animate({
                scrollTop: elementOffset.top + scroller.scrollTop() - scroller.offset().top
            }, 200);
        }
    }
});
