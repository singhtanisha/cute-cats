import { helper as buildHelper } from '@ember/component/helper';
import dateHelper from 'common/helpers/dates';
import { isPresent } from '@ember/utils';

export const ageOnDate = ([birthDate, targetDate, defaultText]) => {
    const ageOnDate = dateHelper.getAgeOnDate(birthDate, targetDate, true);
    const areDatesValid = moment().isValid(birthDate) && moment().isValid(targetDate) && ageOnDate !== 'NaN yrs';
    return (!areDatesValid && isPresent(defaultText)) ? defaultText : ageOnDate;
};

export default buildHelper(ageOnDate);
