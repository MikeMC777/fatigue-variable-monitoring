import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'fvm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  routerConfig: any = {};
  currentUrl: string = '';
  usPhoneInternational = CommonConstants.USOfficePhoneInt;
  usPhoneText = CommonConstants.USOfficePhone;
  crPhoneInternational = CommonConstants.CROfficePhoneInt;
  crPhoneText = CommonConstants.CROfficePhone;

  constructor(private _router: Router) {
    this._router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.currentUrl = this.getFormattedUrl(val.url.split('/'));
      }
    });
  }

  ngOnInit(): void {

  }

  private _mobileMenuOpen: boolean = false;
  set mobileMenuOpen(value:boolean) {
    this._mobileMenuOpen = value;
  }

  get mobileMenuOpen():boolean {
    return this._mobileMenuOpen;
  }

  /*get isHome():boolean {
    return false && this._showTransparent && this._isHome;
  }*/
  private _currentWidth: number | undefined;
  private _scrollPosition: number = 0;

  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    this._scrollPosition = e.target['scrollingElement'].scrollTop;
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: Event): void {
    this._currentWidth = (event.target as Window).innerWidth;
  }

  onToggleMobileMenuHandler(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getFormattedUrl(urlArray: string[]): string {
    var finalUrl = urlArray[urlArray.length - 1];
    return finalUrl.split('?')[0];
  }
}

