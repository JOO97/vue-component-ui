import { withInstall } from '@components-ui/utils/withInstall';
import Input from './src/input.vue';

export type InputInstance = InstanceType<typeof Input>;

Input.name = 'VIInput';
const VIInput = withInstall(Input);

export { VIInput };
export default VIInput;
