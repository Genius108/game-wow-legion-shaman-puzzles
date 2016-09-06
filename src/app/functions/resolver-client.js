export default function resolver() {
    const worker = new Worker('./breeder,js');
    const state = {
        started: false
    };
    worker.addEventListener('message', function(e) {
        console.log('Worker said: ', e.data);
    }, false);

}