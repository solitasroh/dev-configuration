import A2700Data from "@src/Data/A2700Data";
import { Observable } from "rxjs";

interface IStuff {
    getter(): Observable<A2700Data | A2700Data[]>
}

export default IStuff;