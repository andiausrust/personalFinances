import {Component, OnInit, ViewChild} from '@angular/core';
import {IonList, ModalController, Platform, PopoverController} from '@ionic/angular';
import {CashFlowModalPage} from '../cash-flow-modal/cash-flow-modal.page';
import {CashFlow, CashService, Transaction} from '../../services/cash.service';
import {Storage} from '@ionic/storage';
import {FilterPopoverPage} from '../filter-popover/filter-popover.page';

@Component({
    selector: 'app-tracker',
    templateUrl: './tracker.page.html',
    styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {

    selectedCurrency = '';
    transactions: Transaction[] = [];
    allTransactions: Transaction[] = [];
    cashFlow = 0;

    @ViewChild('slidingList', {static: true}) slidingList: IonList;

    constructor(private modalCtrl: ModalController,
                private cashService: CashService,
                private platform: Platform,
                private storage: Storage,
                private popOverCtrl: PopoverController) {
    }

    ngOnInit() {
    }

    async ionViewWillEnter() {
        this.platform.ready();
        this.loadTransactions();
    }

    async addCashFlow() {
        const modal = await this.modalCtrl.create({
            component: CashFlowModalPage,
            cssClass: 'modalCss'
        });
        modal.present();
        modal.onDidDismiss().then(res => {
            if (res && res.data) {
                this.loadTransactions();
            }
        });
    }

    async loadTransactions() {
        await this.storage.get('selected-currency').then(currency => {
            this.selectedCurrency = currency.toUpperCase();
        });
        await this.cashService.getTransactions().then(trans => {
            this.transactions = trans;
            this.allTransactions = trans;
            console.log('transactions', trans);
        });
    }

    async removeTransaction(i: number) {
        this.transactions.splice(i, 1);
        this.cashService.upateTransaction(this.transactions);
        await this.slidingList.closeSlidingItems();
        this.upateCashFlow();
    }

    upateCashFlow() {
        let result = 0;
        this.transactions.map(trans => {
            result += trans.type === CashFlow.Expense ? -trans.value : trans.value;
        });
        this.cashFlow = result;
    }

    async openFilter(e: MouseEvent) {
        const popover = this.popOverCtrl.create({
            component: FilterPopoverPage,
            event: e
        });
        await popover.then(p => {
            p.present();
            p.onDidDismiss().then(
                res => {
                    if (res && res.data) {
                        const selectedName = res.data.selected.name;
                        if (res && res.data.selected.name === 'All') {
                            this.transactions = this.allTransactions;
                        } else {
                            this.transactions = this.allTransactions.filter(trans => {
                                return trans.category.name === selectedName;
                            });
                        }
                    }

                });
        });
    }
}
