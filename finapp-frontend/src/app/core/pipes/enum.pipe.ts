import { inject, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
    name: 'enum',
    standalone: true
})
export class EnumPipe implements PipeTransform {
    private translate = inject(TranslateService);

    transform(key: string, enumGroup: string): string {
        const transaltionKey = `${enumGroup}.${key}`;
        return this.translate.instant(transaltionKey);
    }
}