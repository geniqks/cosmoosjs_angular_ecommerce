import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService
  ) { }

  public ngOnInit() {
    this.translateService.setDefaultLang('fr');
  }

  public ngAfterViewInit() {
    this.translateService.use('fr');
    this.translateService
      .get('primeng')
      .subscribe(res => this.config.setTranslation(res));
  }

  /**
   * Update application language and PrimeNG translations
   * To add more primeng translations
   * @link https://github.com/primefaces/primelocale/tree/main
   */
  public translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe(res => this.config.setTranslation(res));
  }
}
