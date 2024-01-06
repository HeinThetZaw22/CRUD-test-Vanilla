import initialRenders from "./core/initialrender";
import listeners from "./core/listener";

class Course {
    init(){
        console.log('app start');
        initialRenders();
        listeners();
    }
}

export default Course;